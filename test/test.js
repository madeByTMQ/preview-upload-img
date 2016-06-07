
(function(window){

var 
imgContainer = document.getElementById('imgContainer'),
input = document.getElementsByTagName('input')[0],

uploadFile = window.uploadFile;

uploadFile.init({
	uploadInput: input,
	imgContainer: imgContainer,
	onFileChange : function(files) {
		console.log(files, 'file change!');
		console.log(uploadFile.hasFile());
	},
	url: '/uploadImg',
	key: 'keke'
});

//dosomething

//uploadFile.upload(otherFormVaule, name);


})(window)