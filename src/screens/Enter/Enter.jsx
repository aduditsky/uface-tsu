import React, { useState, useEffect } from "react";
import { Link, Redirect } from "react-router-dom";
import Button from "../../components/Button/Button";
import Input from "../../components/Input/Input";
import Modal from "../../components/Modal/Modal";
import css from './Enter.module.css';
import Back from '../../components/Back/Back';
import request from "../../request";
import Spinner from "../../components/Spinner/Spinner";

const Enter = () => {

    const [login, setLogin] = useState("");
    const [password, setPassword] = useState("");
    const [successLogin, setsuccessLogin] = useState(false);
    const [openModal, setOpenModal] = useState(false);
    const [title, setTitle] = useState("Ошибка");
    const [textError, setTextError] = useState("");
    const [loadingData, setloadingData] = useState(true);

    const init = async () => {
        try {
            const obj = {}
            window.location.href.split("?")[1].split("&").map(a => { obj[a.split("=")[0]] = decodeURIComponent(a.split("=")[1]).replaceAll("+", " ") })
            localStorage.setItem("token", obj.tid)
            localStorage.setItem("rtoken", obj.rtid)
            try {
                const data = await request.getAuth(
                    "persident/folklogin")
                if (data.status !== 'error') {
                    localStorage.setItem('token', data.tid)
                    setsuccessLogin(true)
                    setloadingData(false);
                } else {
                    setOpenModal(true)
                    setTitle("Ошибка")
                    setTextError(data.errordesc)
                }
            } catch (error) {
                setOpenModal(true)
                setTitle("Ошибка")
                setTextError("Ошибка сервера")
            }
        } catch {
            setloadingData(false);
            console.log("Авторизация через UFACE")
        }
    }

    useEffect(() => {
        init()
    }, [])


    if (successLogin) return <Redirect to="/profile" />

    return (
        <div className={css.base_container}>
            <Back to='/' />
            <div className={css.header}>Войти</div>
            <div className={css.content}>
                <div className={css.label}>
                    <label >Телефон / E-mail</label>
                </div>
                <div>
                    <Input
                        placeholder="9XXXXXXXXX / E-mail"
                        enterInput
                        type='text'
                        value={login}
                        setValue={(v) => {
                            if (!/[а-я]/gi.test(v)) {
                                setLogin(v)
                            }
                        }}
                        maxLength='40'
                        valid={
                            !(
                                login === "" ||
                                (login !== "" &&
                                    !(
                                        // phone
                                        (
                                            (login.length === 10 &&
                                                login.replace(/[^0-9]/g, "").length === 10 &&
                                                login[0] === "9") ||
                                            // email
                                            (login.indexOf("@") !== 0 &&
                                                login.indexOf("@") !== -1 &&
                                                login.indexOf("@") !== login.length - 1 &&
                                                login.indexOf(".") !== 0 &&
                                                login.indexOf(".") !== -1 &&
                                                login.indexOf(".") !== login.length - 1)
                                        )
                                    ))
                            )
                        }
                    />
                </div>
                <div className={css.label}>
                    <label>Пароль</label>
                </div>
                <div>
                    <Input

                        enterPassword
                        value={password}
                        setValue={(value) => {
                            if (value.length <= 20) {
                                setPassword(value)
                            }
                        }}
                        type='text'
                        EyeOpen
                        valid={password !== "" && password.length >= 6 && password.length <= 20}
                        name="password" />
                </div>
                <div className={css.passLink}>
                    <Link to='/recoverPWD' className={css.passLink} >Забыли пароль?</Link>
                </div>
                <Button to='#'
                    disabled={
                        (
                            (
                                login === "" ||
                                (login !== "" &&
                                    !(
                                        // phone
                                        (
                                            (login.length === 10 &&
                                                login.replace(/[^0-9]/g, "").length === 10 &&
                                                login[0] === "9") ||
                                            // email
                                            (login.indexOf("@") !== 0 &&
                                                login.indexOf("@") !== -1 &&
                                                login.indexOf("@") !== login.length - 1 &&
                                                login.indexOf(".") !== 0 &&
                                                login.indexOf(".") !== -1 &&
                                                login.indexOf(".") !== login.length - 1)
                                        )
                                    ))
                            )
                            ||
                            !(password !== "" && password.length >= 6 && password.length <= 20)
                        )
                    }
                    onclick={async () => {
                        try {
                            const data = await request.post(
                                "persident/folklogin",
                                [
                                    ["login", login[0] === "9" ? ("7" + login) : login],
                                    ["pass", password]
                                ]
                            )
                            if (data.status !== 'error') {
                                setTitle("Успешно")
                                localStorage.setItem('token', data.tid)
                                localStorage.setItem('rtoken', data.rtid)
                                setsuccessLogin(true)
                            } else {
                                setOpenModal(true)
                                setTitle("Ошибка")
                                setTextError(data.errordesc)
                            }
                        } catch (error) {
                            setOpenModal(true)
                            setTitle("Ошибка")
                            setTextError("Ошибка сервера")
                        }
                    }}
                >
                    Далее</Button>
            </div>
            <div className={css.regBtn}>
                <label className={css.passLink2}>Нет учетной записи?</label>
                <Link to='/formPart1' className={css.passLink, css.registration} >Регистрация</Link>
            </div>
            <Modal
                open={openModal}
                close={() => setOpenModal(false)}
                title={title}
                text={textError}
                BtnClick={() => setOpenModal(false)}
                buttonTitle="Ок"
            />
            <Spinner show={loadingData} />
        </div>
    )
}

export default Enter;