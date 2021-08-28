import { useState, useRef, useEffect } from "react";
import photo from "../../images/photo.jpg";
import Button from "../../components/Button/Button";
import css from './FormPart2.module.css';
import { Link, Redirect } from "react-router-dom";
import Back from "../../components/Back/Back";
import smile from "../../images/smile.svg";
import getMobileOperatingSystem from "../../getMobileOperatingSystem";

const FormPart2 = () => {
    const [image, setimage] = useState(sessionStorage.getItem("recoverPhoto") || photo || null)
    const [isCamera, setIsCamera] = useState(false);
    const [noPhoto, setNoPhoto] = useState(false);
    const [ok, setOk] = useState(false);
    const [seconds, setSeconds] = useState(3);
    const [cameraSize, setCameraSize] = useState({
        width: 0,
        height: 0
    });

    var ios = false;

    const camera = useRef();

    const shot = () => {
        let secondsTmp = 3;
        let timer = setInterval(() => {
            if (secondsTmp === 0) {
                var canvas = document.createElement("canvas");
                canvas.width = cameraSize.width;
                canvas.height = cameraSize.height;
                canvas.getContext("2d").drawImage(camera.current, 0, 0, cameraSize.width, cameraSize.height);

                setimage(canvas.toDataURL());
                setSeconds(3);
                setNoPhoto(false)
                setOk(true)
                sessionStorage.setItem('recoverPhoto', canvas.toDataURL())
                clearInterval(timer);
            } else {
                setSeconds((prev) => prev - 1);
                secondsTmp -= 1;
            }
        }, 1000);
    };

    useEffect(() => {
        init()
        const getm = getMobileOperatingSystem
        if (getm === "iOS") {
            ios = true;
        }
    }, [])

    const onChangeFile = async (e) => {
        const file = e.currentTarget.files[0];
        const result = await toBase64(file).catch(e => Error(e));
        setimage(result)
        sessionStorage.setItem('recoverPhoto', result)
    }

    const toBase64 = file => new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });

    const init = async () => {
        const recoverPhoto = sessionStorage.getItem('recoverPhoto')
        if (recoverPhoto) {
            setimage(recoverPhoto)
        }
    }

    let inpFile = null

    if (ok) return <Redirect to="/formPart3" />

    return (
        <div className={css.base_container}>
            <Back to='/formPart1' />
            <div className={css.header}>Подтвердите свою личность</div>
            <div className={css.content}>
                {
                    !noPhoto ? (
                        <div>
                            <div>
                                <img className={css.image} src={image} alt="nophoto" />
                            </div>
                            <div className={css.label}>
                                <label>Необходимо добавить фото</label>
                            </div>
                            <div className={css.smile}>
                                <img src={smile} alt="smile" />
                            </div>
                            <div className={css.buttons}>
                                {
                                    !ios ? (
                                        <div>
                                            <Link to='#' className={css.buttons} onClick={
                                                () => {
                                                    setNoPhoto(true)
                                                    setIsCamera(true)
                                                    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
                                                        navigator.mediaDevices
                                                            .getUserMedia({ video: true })
                                                            .then(function (stream) {
                                                                camera.current.srcObject = stream;
                                                                camera.current.play();
                                                                const { width, height } = stream.getTracks()[0].getSettings();
                                                                setCameraSize({
                                                                    width,
                                                                    height
                                                                });
                                                            });
                                                    }
                                                }
                                            }>Сфотографироваться</Link>
                                            <input
                                                type="file"
                                                accept="video/*"
                                                capture="camera"
                                                onChange={onChangeFile}
                                                style={{ display: 'none' }}
                                            ></input>
                                        </div>
                                    ) :
                                        (<Link to='#' className={css.buttons} onClick={
                                            () => {
                                                setNoPhoto(true)
                                                setIsCamera(true)
                                                if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
                                                    navigator.mediaDevices
                                                        .getUserMedia({ video: true })
                                                        .then(function (stream) {
                                                            camera.current.srcObject = stream;
                                                            camera.current.play();
                                                            const { width, height } = stream.getTracks()[0].getSettings();
                                                            setCameraSize({
                                                                width,
                                                                height
                                                            });
                                                        });
                                                }
                                            }
                                        }>Сфотографироваться</Link>)
                                }
                            </div>
                        </div>

                    ) : (
                        <div className={css.app}>
                            <video className={css.image} ref={camera} width="340" height="340" autoplay></video>
                            <div className={css.label}>
                                <label>Наведите камеру так, чтобы лицо поместилось в круг</label>
                            </div>
                            <h1 className={css.timer}>{seconds}</h1>
                            <div className={css.smile}>
                                <img src={smile} alt="smile" />
                            </div>
                            <div className={css.buttons}>
                                <Link to="#" className={css.buttons} onClick={() => { shot() }}>Сделать фото</Link>
                            </div>
                        </div>
                    )
                }
                <div className={css.nextBtn}>
                    <Button
                        to={
                            sessionStorage.getItem("recoverPhoto") ?
                                '/formPart3' :
                                '#'
                        }
                    >Далее</Button>
                </div>
                <form id="idregform" name="regform" action="" enctype="multipart/form-data">
                    <input
                        onChange={onChangeFile}
                        style={{ display: 'none' }}
                        type="file"
                        id="fileimg"
                        ref={(inp) => inpFile = inp}
                        accept="image/x-png,image/gif,image/jpeg"
                    >
                    </input>
                    <div className={css.buttons}>
                        <Link to='#' className={css.buttons} onClick={
                            () => { inpFile.click() }}>
                            Загрузить фото</Link>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default FormPart2;