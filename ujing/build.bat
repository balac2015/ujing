%~d0
cd %~dp0
gulp requirejs --gulpfile %NODE_PATH%\..\tools\gulpfile.js --cwd %~dp0 && gulp build --gulpfile %NODE_PATH%\..\tools\gulpfile.js --cwd %~dp0 && gulp concat-origin --gulpfile %NODE_PATH%\..\tools\gulpfile.js --cwd %~dp0 && gulp concat --gulpfile %NODE_PATH%\..\tools\gulpfile.js --cwd %~dp0 && gulp zip --gulpfile %NODE_PATH%\..\tools\gulpfile.js --cwd %~dp0
pause
