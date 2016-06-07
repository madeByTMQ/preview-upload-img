//不包含任何样式，但是预先写了类名，在dom中清晰可见
window.uploadFile = (function(){
  var 
  config = {
    uploadInput: null,
    imgContainer: null,
    key: '', 
    url: '',
    onFileChange: function(files) {
      return;
    }
  },

  uploadFiles = [],

  getImgInfo = function(files) {

    var 
    i = 0,
    len = 0,
    over = false,

    readFile = function() {
      var 
      reader = new FileReader();

      reader.onload = function(ev) {

        len = uploadFiles.push(files[i]);
        files[i].index = len - 1;

        renderImg({
          src:ev.target.result,
          name: files[i].name,
          index: len - 1
        });
        i++;

        if (files[i]) {
          readFile();
        } else {
          over = true;
        }
      };

      reader.readAsDataURL(files[i]);
    };
    readFile();
  },

  deleteImg = function(dom, index) {
    var 
    last,
    len = uploadFiles.length;

    for (var i = 0, file; file = uploadFiles[i]; i++) {

      if (file.index == index) {
        last = uploadFiles.pop();
        last.index = i;
        if (last.index === len - 1) {
          break;
        }
        dom.parentNode.lastElementChild.setAttribute( 'data-index' , i);
        uploadFiles.splice(i,1,last);
        break;
      }
    }
    config.onFileChange(uploadFiles);

    dom.classList.add('upload-remove');
    setTimeout(function(){
      this.parentNode.removeChild(this);
    }.bind(dom),100);
  },

  renderImg = function(obj) {
    var 
    html = '',
    outerDiv = document.createElement('div'),

    handler = function(ev) {
      ev = ev || window.event;
      if (ev.target.nodeName.toLowerCase() === 'a'){
        deleteImg(this, this.getAttribute('data-index'));
        this.removeEventListener('click', handler, false);
      }
    };

    outerDiv.className = 'upload';
    outerDiv.setAttribute('data-index', obj.index);

    html = "<div class='upload-title'>" + obj.name + "<a href='javascript:;'>删除</a></div><div class='upload-pre'><img src=" + obj.src +
             "></div>";

    outerDiv.innerHTML = html;
    outerDiv.addEventListener('click', handler, false);
    config.imgContainer.appendChild(outerDiv);
    config.onFileChange(uploadFiles);
  },

  getFiles = function(ev) {

    var temp = Array.prototype.slice.call(ev.target.files);
    getImgInfo(temp);
    ev.target.value = '';
  },

  hasFile = function() {
    var len = uploadFiles.length;
    if (len === 0) {
      return false;
    }

    return true;
  },

  init = function(obj) {

    for (var prop in obj) {
      config[prop] = obj[prop];
    }

    config.uploadInput.addEventListener('change', function(ev){
      getFiles(ev);
    });
  },

  upload = function(body, callback) {
    var oData = new FormData();

    uploadFiles.forEach(function(item){
      oData.append(config.key, item);
    });

    if (body) {
      for (var prop in body) {
        oData.append(prop, body[prop]);
      }
    }

    var xhr = new XMLHttpRequest();
    if (xhr.upload) {
      xhr.addEventListener('progress', function(e) {
        console.log(e.loaded, e.total);
      }, false);

      xhr.onreadystatechange = function(e) {
        if (xhr.readyState == 4) {
          if (xhr.status == 200) {
            console.log(xhr.responseText);

            uploadFiles.length = 0;
            config.imgContainer.innerHTML = '';
            callback && callback(xhr.responseText);
          } else {
            console.log('error');   
          }
        }
      };

      xhr.open('POST', config.url, true);
      xhr.send(oData);
    }
  };

  return {
    init: init,
    upload: upload,
    hasFile: hasFile
  };

})();