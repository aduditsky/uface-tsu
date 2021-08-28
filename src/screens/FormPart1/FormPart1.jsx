/* eslint-disable */
import React, { useState, useEffect } from "react";
import Button from "../../components/Button/Button";
import Input from "../../components/Input/Input";
import css from './FormPart1.module.css';
import Back from '../../components/Back/Back';
import Select from "../../components/Select/Select";
import PhoneInput from "../../components/PhoneInput/PhoneInput";
import request from "../../request";

const FormPart1 = () => {
    const [lastName, setLastName] = useState("");
    const [firstName, setFirstName] = useState("");
    const [patronymic, setPatronymic] = useState("");
    const [phone, setPhone] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [password2, setPassword2] = useState("");
    const [institute, setInstitute] = useState("1");
    const [role, setRole] = useState("1");
    const [dateborn, setDateborn] = useState("");
    const [checkboxClick, setCheckboxClick] = useState(false);
    const [institutes, setinstitutes] = useState([])
    const [folkroles, setfolkroles] = useState([])

    useEffect(() => {
        regTsuAcc()
        init()
    }, [])

    const regTsuAcc = async () => {
        try {
            const obj = {}
            window.location.href.split("?")[1].split("&").map(a => { obj[a.split("=")[0]] = decodeURIComponent(a.split("=")[1]).replaceAll("+", " ") })
            const ln = obj.fio.split(' ')[0]
            const fn = obj.fio.split(' ')[1]
            const p = obj.fio.split(' ')[2]
            setLastName(ln)
            setFirstName(fn)
            setPatronymic(p)
            setDateborn(obj.bdate)
            setPhone(obj.phone)
            setEmail(obj.email)
        }
        catch
        {

        }
    }

    const init = async () => {
        const dataInst = await request.get("persident/getinstitutes")
        const dataFolk = await request.get("persident/getfolkroles")
        setinstitutes(dataInst)
        setfolkroles(dataFolk)
        const recoverData = sessionStorage.getItem('recoverData')
        if (recoverData) {
            const tmp = JSON.parse(recoverData)
            setLastName(tmp.lastName)
            setFirstName(tmp.firstName)
            setPatronymic(tmp.patronymic)
            setDateborn(tmp.dateborn)
            setPhone(tmp.phone)
            setEmail(tmp.email)
            setPassword(tmp.password)
            setPassword2(tmp.password2)
            setRole(tmp.role)
            setInstitute(tmp.institute)
            setCheckboxClick(tmp.checkboxClick)
        }
    }

    const submit = () => {
        sessionStorage.setItem('recoverData',
            JSON.stringify({
                lastName, firstName, patronymic, phone, email, password, password2, role, institute, dateborn, checkboxClick
            })
        )
    }

    return (
        <div className={css.base_container}>
            <Back to='/' />
            <div className={css.header}>Заполните <br />анкету</div>
            <div className={css.inputs}>
                <div className={css.formInput}>
                    <Input
                        placeholder="Иванов"
                        label='Фамилия*'
                        type='text'
                        name="lastName"
                        value={lastName}
                        valid={lastName !== "" && lastName.length <= 20 && validateName(lastName)}
                        setValue={(v) => {
                            if (!/[a-z0-9]/gi.test(v)) {
                                setLastName(v.charAt(0).toUpperCase() + v.slice(1))
                            }
                        }}
                        maxLength='20'
                    />
                </div>
                <div className={css.formInput}>
                    <Input
                        placeholder="Иван"
                        value={firstName}
                        setValue={(v) => {
                            if (!/[a-z0-9]/gi.test(v)) {
                                setFirstName(v.charAt(0).toUpperCase() + v.slice(1))
                            }
                        }}
                        label='Имя*' type='text'
                        name="firstName"
                        valid={firstName !== "" && firstName.length <= 20 && validateName(firstName)}
                        maxLength='20' />
                </div>
                <div className={css.formInput}>
                    <Input
                        placeholder="Иванович"
                        value={patronymic}
                        setValue={(v) => {
                            if (!/[a-z0-9]/gi.test(v)) {
                                setPatronymic(v.charAt(0).toUpperCase() + v.slice(1))
                            }
                        }}
                        label='Отчество*' type='text'
                        name="patronymic"
                        valid={patronymic !== "" && patronymic.length <= 20 && validateName(patronymic)}
                        maxLength='20' />
                </div>
                <div className={css.formInput}>
                    <Input
                        valid={
                            dateborn.indexOf("_") === -1 && dateborn.length > 0
                        }
                        value={dateborn}
                        type="date"
                        setValue={(e) => {
                            setDateborn(e)
                        }}
                        label='Дата рождения*'
                    />
                </div>
                <div className={css.formInput}>
                    <PhoneInput
                        placeholder="+7 000 000 0000"
                        value={phone}
                        label='Номер сотового телефона*'
                        setValue={setPhone}
                    />
                </div>
                <div className={css.formInput}>
                    <Input
                        valid={validateEmail(email)}
                        value={email}
                        setValue={(v) => {
                            if (!/[а-я]/gi.test(v)) {
                                setEmail(v)
                            }
                        }}
                        placeholder="ivanov@gmail.com"
                        label='E-mail*'
                        type='email'
                        name="email"
                        maxLength='30' />
                </div>
                <div className={css.formInput}>
                    <Input
                        EyeOpen
                        valid={password !== "" && password.length >= 6 && password.length <= 20}
                        value={password}
                        setValue={(value) => {
                            if (value.length <= 20) {
                                setPassword(value)
                            }
                        }}
                        label='Пароль*'
                        type='text'
                        password
                        name="password" />
                </div>
                <div className={css.formInput}>
                    <Input
                        EyeOpen
                        valid={password !== "" && password.length >= 6 && password.length <= 20 && password2 === password}
                        value={password2}
                        setValue={(value) => {
                            if (value.length <= 20) {
                                setPassword2(value)
                            }
                        }}
                        label='Повторите пароль*'
                        type='text'
                        password
                        name="password" />
                </div>
            </div>
            {
                (institutes && folkroles) && (
                    <div className={css.selects}>
                        <div className={css.formSelect}>
                            <Select
                                value={role}
                                disabled={false}
                                setValue={setRole}
                                label='Статус*'
                                options={folkroles}
                                name="role" />
                        </div>
                        <div className={css.formSelect}>
                            <Select
                                value={institute}
                                disabled={false}
                                setValue={setInstitute}
                                label='ВУЗ*'
                                options={institutes}
                                name="institute" />
                        </div>
                    </div>
                )
            }
            <div className={css.checkbox}>
                <div className={css.checkboxNative}>
                    <input type="checkbox" checked={checkboxClick} onChange={() => setCheckboxClick(!checkboxClick)} />
                </div>
                <div className={css.formInput}>
                    <a className={css.checkboxText} target='blank' href="https://uface.su/politikaPd.pdf">
                        Даю свое согласие на обработку персональных данных
                    </a>
                </div>
            </div>

            <div className={css.enterBtn}>
                <Button onclick={submit}

                    disabled={
                        !(
                            lastName !== "" && lastName.length <= 20 && validateName(lastName) &&
                            firstName !== "" && firstName.length <= 20 && validateName(firstName) &&
                            patronymic !== "" && patronymic.length <= 20 && validateName(patronymic) &&
                            dateborn.indexOf("_") === -1 &&
                            validateEmail(email) &&
                            password !== "" && (password.length >= 6 && password.length <= 20) &&
                            password2 !== "" && (password2.length >= 6 && password2.length <= 20) && password2 === password &&
                            checkboxClick === (true))
                    }
                    to={
                        sessionStorage.getItem("recoverPhoto") ?
                            '/formPart3' :
                            '/formPart2'
                    }>
                    Далее</Button>
            </div>
        </div>
    )
}

function validateEmail(email) {
    const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}

function validateName(value) {
    const reg = /^[А-Яа-я]+$/;
    return reg.test(value);
}

export default FormPart1;