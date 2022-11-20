rm -f ./upload/*

# curl -F 'data=@./files_test/test.txt' http://localhost:3000/upload
curl -F 'data=@./files_test/avatar.jpg' http://localhost:3000/upload
# curl -F 'data=@./files_test/test.pdf' http://localhost:3000/upload

# curl -F 'fileX=@./files_test/one.txt' -F 'fileY=@./files_test/avatar.jpg' -F 'fileZ=@./files_test/three.txt' http://localhost:3000/upload