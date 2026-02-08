@echo off
REM Change directory to the folder where this script is located
cd /d %~dp0

REM Start the server in a new window
start cmd /c "npx serve -s dist -l 3010"

REM Wait until localhost:3010 is ready using PowerShell loop
powershell -Command ^
    "$url='http://localhost:3010';" ^
    "while ($true) {" ^
        "try {" ^
            "$res = Invoke-WebRequest -Uri $url -UseBasicParsing -TimeoutSec 2;" ^
            "if ($res.StatusCode -eq 200) { break }" ^
        "} catch {}" ^
        "Start-Sleep -Seconds 1;" ^
    "};" ^
    "Start-Process $url"