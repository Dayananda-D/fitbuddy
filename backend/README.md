### server side  
 Create Python virtual enviroment (further just venv)(optional, but will prevent some unexpected errors)
```

python -m venv .venv
```	
Open the 'activate.ps1' file in Visual Studio Code using the path '.\.venv\Scripts\activate.bat', then click the run button in the right-side corner.
 This will activate the virtual environment (.venv). Additionally, update the path to the server.
```

pip install -r requirements.txt
```

To run the app 
```
uvicorn backend.main:app --reload
```
download the https://www.sqlite.org/2024/sqlite-tools-win-x64-3470200.zip 
and run the sqlite3
install the SQLite Viewer vscode: Extension to view the data base