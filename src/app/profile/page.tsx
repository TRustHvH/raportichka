import { Box } from "@/components/Box/Box"
import { Layout } from "@/components/Layout/Layout"
import { TextInput } from "@/components/Input/Input"
import { Button } from "@/components/Button/Button"
import { Option } from "@/components/Select/Option"
import { Select } from "@/components/Select/Select"
import { Input } from "postcss"


const ProfilePage = () => {

    const group = "21-ИПТ"

    const members = [
        "Анисимова Ирина",
        "Балкова Ксения",
        "Богатков Александр",
        "Гембарук Анастасия",
        "Ильичев Максим",
        "Исхакова Татьяна",
        "Канатаев Артем",
        "Карабанов Артем",
        "Карачев Геннадий",
        "Ковенкова Юлия",
        "Комаров Роман",
        "Новожилов Даниил",
        "Озерин Вадим",
        "Пасынкова Елена",
        "Поляков Иван",
        "Прокопова Дарина",
        "Сердцев Михаил",
        "Смирнов Алексей",
        "Тимичев Денис",
        "Цепицин Василий"
    ]

    const class_owner = "Ларина Надежда Евгеньевна"

    const date = new Date()

    const getSuffix = (num: number): string => {
        const suffixes: { [key: number]: string } = {
            1: '-й',
            21: '-й',
            31: '-й',
            2: '-й',
            22: '-й',
            3: '-й',
            23: '-й',
            4: '-й',
            24: '-й'
        };
        return suffixes[num] || '-й';
    };

    const day = date.getDate()
    const month = date.toLocaleString('ru-ru', { month: 'long' });
    const year = date.getFullYear()

    return <>
        <Layout>
            <Box>
                <h1>РАПОРТИЧКА. Дата {`${month} ${day}${getSuffix(day)} ${year}`}</h1>
                <div className="info">
                    <p>Группа: {group}</p>
                    <p>Общее кол-во чел: {members.length}</p>
                    <p>ФИО кл.рук: {class_owner}</p>
                </div>
                <Select description="ФИО обучающегося" className="small">
                    {members.map((item, index) => (
                        <Option key={index}>{item}</Option>
                    ))}
                </Select>
                <TextInput className="small" label="Причина пропуска/опоздания"></TextInput>
                <Button>Отправить</Button>
            </Box>
            <Box className="w-full box-flex">
                <div>
                    {members.map((item, index) => (
                        <p key={index}>{item}</p>
                    ))}
                </div>
            </Box>
        </Layout>
    </>
}

export default ProfilePage