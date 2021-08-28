const shot = (photo) => {
    let secondsTmp = 3;
    let timer = setInterval(() => {
      if (secondsTmp === 0) {
        var canvas = document.createElement("canvas");

        canvas.width = 640;
        canvas.height = 480;
        canvas.getContext("2d").drawImage(camera.current, 0, 0, 640, 480);

        // setimage(canvas.toDataURL());
        // setSeconds(3);
        // setNoPhoto(false)
        sessionStorage.setItem({photo}, canvas.toDataURL())
        clearInterval(timer);
      } else {
        // setSeconds((prev) => prev - 1);
        secondsTmp -= 1;
      }
    }, 1000);
  };

  const onChangeFile = async (e, photo) => {
        const file = e.currentTarget.files[0];
        const result = await toBase64(file).catch(e => Error(e));
        sessionStorage.setItem({photo}, result)
    }

    const toBase64 = file => new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });

    const init = async (photo) => {
        const recoverPhoto = sessionStorage.getItem({photo})
        if (recoverPhoto){
            setimage(recoverPhoto)
        }
    }

    let inpFile = null

export default {
  shot,
  onChangeFile,
  toBase64,
  init
}