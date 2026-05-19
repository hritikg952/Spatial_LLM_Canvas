$dir = Split-Path -Parent $MyInvocation.MyCommand.Path
& "$dir\venv\Scripts\Activate.ps1"
uvicorn main:app --reload
