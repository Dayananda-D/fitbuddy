
import os
import pandas as pd
from .. import models, database
from sqlalchemy.exc import SQLAlchemyError

CSV_PATH = "megaGymDataset.csv"

# Determine the project root directory
def get_project_root():
    # Get the directory of the current script
    current_dir = os.path.dirname(os.path.abspath(__file__))
    
    # Go up one or more levels to find the project root
    # Adjust the number of '..' as needed to reach the project root
    project_root = os.path.abspath(os.path.join(current_dir, '..', '..'))
    return project_root

def find_csv_file(filename='megaGymDataset.csv'):
    project_root = get_project_root()
    
    # List of potential directories to search
    search_paths = [
        project_root,
        os.path.join(project_root, 'data'),
        os.path.join(project_root, 'dataset'),
        os.path.join(project_root, 'backendauth'),
        os.path.join(project_root, 'backendauth', 'data'),
        os.path.dirname(os.path.abspath(__file__))
    ]
    
    for path in search_paths:
        full_path = os.path.join(path, filename)
        if os.path.exists(full_path):
            print(f"Found CSV file at: {full_path}")
            return full_path
    
    print(f"Could not find {filename} in any of the searched locations.")
    return None

def import_exercises_to_sqlite(csv_path, db_path):
    """
    Import exercises to SQLite database, creating table if not exists
    
    Args:
        csv_path (str): Path to the CSV file
        db_path (str): Path to the SQLite database
    """
    # Read the CSV file
    try:
        project_root = get_project_root()
        print(find_csv_file())
        df = pd.read_csv(find_csv_file())
    except Exception as e:
        print(f"Error reading CSV file: {e}")
        return

    # Rename columns to match SQLAlchemy model
    df.columns = [
        'id', 'title', 'description', 'type', 
        'body_part', 'equipment', 'level', 
        'rating', 'rating_description'
    ]

    # Create a session
    # Session = sessionmaker(bind=database.engine)
    session = database.SessionLocal()

    try:
        # Check if table is empty
        existing_count = session.query(models.Exercise).count()
        
        if existing_count > 0:
            print(f"Table already contains {existing_count} records. Skipping import.")
            return

        # Bulk insert exercises
        exercises = []
        for _, row in df.iterrows():
            exercise = models.Exercise(
                id=row['id'],
                title=row['title'],
                description=row['description'],
                type=row['type'],
                body_part=row['body_part'],
                equipment=row['equipment'],
                level=row['level'],
                rating=row['rating'],
                rating_description=row['rating_description']
            )
            exercises.append(exercise)

        # Add all exercises
        session.add_all(exercises)
        session.commit()

        print(f"Successfully imported {len(exercises)} exercise records")

    except SQLAlchemyError as e:
        session.rollback()
        print(f"Database error: {e}")
    
    finally:
        session.close()

def explore_exercise_data(csv_path):
    """
    Provide insights about the exercise dataset
    """
    try:
        df = pd.read_csv(csv_path)
        
        print("Dataset Overview:")
        print("-----------------")
        print(f"Total number of exercises: {len(df)}")
        print("\nColumn Information:")
        print(df.info())
        
        print("\nUnique Values:")
        print("Types of Exercises:", df['Type'].unique())
        print("Body Parts:", df['BodyPart'].unique())
        print("Equipment Used:", df['Equipment'].unique())
        print("Difficulty Levels:", df['Level'].unique())
        
        print("\nRating Statistics:")
        print(df['Rating'].describe())
    
    except Exception as e:
        print(f"Error exploring data: {e}")

# import_exercises_to_sqlite(CSV_PATH, database.get_db())