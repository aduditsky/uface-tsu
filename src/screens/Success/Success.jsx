import React from "react";
import Frame from "../../images/Frame.svg";
import Button from "../../components/Button/Button";
import css from './Success.module.css';
import Back from "../../components/Back/Back";

const Success = () => {
    return (
        <div className={css.base_container}>
            <Back to='/enter'
                onclick={() => { localStorage.clear(); sessionStorage.clear() }} />
            <div className={css.header}>Анкета успешно заполнена</div>
            <div className={css.content}>
                <center>
                    <div style={{
                        marginTop: 41,
                        marginBottom: 65,
                        width: 111,
                        height: 111,
                        borderRadius: 128,
                        backgroundColor: "#247ABF"
                    }}>
                        <img style={{ width: 48, height: 65, marginTop: 24 }} src={Frame} alt="ok" />
                    </div>
                </center>
                <div className={css.label1}>
                    <label>Необходимо подтвердить Вашу учетную запись. На указанный вами при регистрации e-mail <b style={{ color: "black", textDecoration: "underline" }}>{JSON.parse(sessionStorage.getItem("recoverData")).email}</b> направлено письмо со ссылкой для активации.</label><br /><br />
                    <label>В Личном кабинете пользователя подтвердите номер телефона.</label>
                </div>
                <div className={css.label2}>
                    <label>Изменить информацию можно во вкладке "Настройки"</label>
                </div>
                <Button
                    onclick={() => { localStorage.clear(); sessionStorage.clear() }}
                    to='/enter'>Далее</Button>
            </div>
        </div>
    )
}

export default Success;