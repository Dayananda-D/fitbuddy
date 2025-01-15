import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ActivityIndicator,
    ImageBackground,
    TouchableOpacity,
    Image,
    ScrollView,
    TextInput,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';

const Profile = () => {
    const [profileData, setProfileData] = useState({
        name: '',
        email: '',
        dateOfBirth: '',
        gender: '',
        goal: '',
        height: '',
        weight: '',
        level: '',
        selectedBodyParts: [],
    });
    const [profileImage, setProfileImage] = useState(null);
    const [loading, setLoading] = useState(true);
    const [editingField, setEditingField] = useState(null);
    const navigation = useNavigation();


    useEffect(() => {
        const fetchProfileData = async () => {
            try {
                const data = await AsyncStorage.getItem('baseData');
                const image = await AsyncStorage.getItem('profile_image');
                if (data) {
                    setProfileData(JSON.parse(data));
                }
                if (image) {
                    setProfileImage(image);
                }
            } catch (error) {
                console.error('Error fetching profile data', error);
            } finally {
                setLoading(false);
            }
        };

        fetchProfileData();
    }, []);

    const saveFieldToLocalStorage = async (field, value) => {
        try {
            const updatedProfile = { ...profileData, [field]: value };
            setProfileData(updatedProfile);
            await AsyncStorage.setItem('baseData', JSON.stringify(updatedProfile));
            setEditingField(null);
        } catch (error) {
            console.error('Error saving profile data', error);
        }
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#4CAF50" />
                <Text style={styles.loadingText}>Loading Profile...</Text>
            </View>
        );
    }

    return (
        <ImageBackground
            source={require('../../assets/images/background.png')}
            style={styles.background}
        >
            <View style={styles.container}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => navigation.goBack()}
                >
                    <Icon name="arrow-back" size={28} color="white" />
                </TouchableOpacity>

                <View style={styles.header}>
                    <View style={styles.profileImageContainer}>
                        {profileImage ? (
                            <Image
                                source={{ uri: profileImage }}
                                style={styles.profileImage}
                            />
                        ) : (
                            <View style={styles.placeholderImage}>
                                <Text style={styles.placeholderText}>No Image</Text>
                            </View>
                        )}
                    </View>
                    <Text style={styles.nameText}>
                        {profileData.name || 'No Name'}
                    </Text>
                </View>

                <ScrollView contentContainerStyle={styles.detailsContainer}>
                    {[
                        { label: 'Email', value: profileData.email, icon: 'mail-outline' },
                        { label: 'Date of Birth', value: profileData.dateOfBirth.split('T')[0], icon: 'calendar-outline' },
                        { label: 'Gender', value: profileData.gender, icon: 'person-outline' },
                        { label: 'Goal', value: profileData.goal, icon: 'trophy-outline' },
                        // { label: 'Height', value: profileData.height, icon: 'expand-outline' },
                        // { label: 'Weight', value: profileData.weight, icon: 'barbell-outline' },
                        { label: 'Level', value: profileData.level, icon: 'trending-up-outline' },
                        {
                            label: 'Selected Body Parts',
                            value: profileData.selectedBodyParts.join(', ') || 'None',
                            icon: 'body-outline',
                        },
                    ].map((item, index) => (
                        <View key={index} style={styles.detailTile}>
                            <Icon name={item.icon} size={24} color="#4CAF50" style={styles.icon} />
                            <Text style={styles.detailLabel}>{item.label}  :  {item.value || 'N/A'}</Text>
                        </View>

                    ))}
                    <View style={styles.detailTile}>
                        <Icon name="expand-outline" size={24} color="#4CAF50" style={styles.icon} />
                        {editingField === 'height' ? (
                            <TextInput
                                style={styles.input}
                                value={profileData.height}
                                onChangeText={(text) =>
                                    setProfileData((prev) => ({ ...prev, height: text }))
                                }
                                keyboardType="numeric"
                                onBlur={() => saveFieldToLocalStorage('height', profileData.height)}
                            />
                        ) : (
                            <Text style={styles.detailLabel}>
                                Height: {profileData.height || 'N/A'}
                            </Text>
                        )}
                        <TouchableOpacity onPress={() => setEditingField('height')}>
                            <Icon name="create-outline" size={24} color="#4CAF50" />
                        </TouchableOpacity>
                    </View>

                    <View style={styles.detailTile}>
                        <Icon name="barbell-outline" size={24} color="#4CAF50" style={styles.icon} />
                        {editingField === 'weight' ? (
                            <TextInput
                                style={styles.input}
                                value={profileData.weight}
                                onChangeText={(text) =>
                                    setProfileData((prev) => ({ ...prev, weight: text }))
                                }
                                keyboardType="numeric"
                                onBlur={() => saveFieldToLocalStorage('weight', profileData.weight)}
                            />
                        ) : (
                            <Text style={styles.detailLabel}>
                                Weight: {profileData.weight || 'N/A'}
                            </Text>
                        )}
                        <TouchableOpacity onPress={() => setEditingField('weight')} style={styles.editIcon}>
                            <Icon name="create-outline" size={24} color="#4CAF50" />
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </View>
        </ImageBackground>
    );
};

const styles = StyleSheet.create({
    background: {
        flex: 1,
    },
    container: {
        flex: 1,
        paddingHorizontal: 16,
        paddingTop: 60,
    },
    backButton: {
        position: 'absolute',
        top: 20,
        left: 16,
        padding: 8,
        borderRadius: 5,
        zIndex: 10
    },
    header: {
        alignItems: 'center',
        // marginBottom: 24,
        bottom: 28
    },
    profileImageContainer: {
        width: 120,
        height: 120,
        borderRadius: 60,
        overflow: 'hidden',
        backgroundColor: '#CCC',
        justifyContent: 'center',
        alignItems: 'center',
    },
    profileImage: {
        width: '100%',
        height: '100%',
    },
    placeholderImage: {
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    placeholderText: {
        color: '#FFF',
        fontSize: 16,
    },
    nameText: {
        fontSize: 22,
        fontWeight: 'bold',
        color: 'white',
        marginTop: 12,
    },
    detailsContainer: {
        paddingVertical: 16,
        backgroundColor: '#ad92b74a',
        borderRadius: 10
    },
    detailTile: {
        // backgroundColor: '#FFF',
        borderRadius: 10,
        flexDirection: 'row',
        alignItems: 'center',
        // padding: 16,
        marginVertical: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,

        // flexDirection: "row",
        // justifyContent: "space-between",
        // alignItems: "center",
        padding: 15,
        // backgroundColor: "#2D2D50",
        marginVertical: 5,
        borderRadius: 10,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    input: {
        borderWidth: 1,
        borderColor: '#CCC',
        borderRadius: 8,
        paddingHorizontal: 10,
        paddingVertical: 5,
        color: 'white',
        flex: 1,
        marginRight: 10,
    },
    icon: {
        marginRight: 8,
    },
    detailLabel: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
        marginRight: 8, // Space between label and value
    },
    detailValue: {
        fontSize: 16,
        color: '#666',
        flexShrink: 1, // Prevent the value from overflowing
    },
    detailLabel: {
        color: 'white',
        fontSize: 14,
        marginBottom: 4,
    },
    detailValue: {
        fontSize: 16,
        fontWeight: '600',
        color: 'white',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        marginTop: 10,
        fontSize: 16,
        color: '#666',
    },
    editIcon: {
        
    }
});

export default Profile;
