import { Box } from "@/components/Box/Box"
import { Layout } from "@/components/Layout/Layout"
import { TextInput } from "@/components/Input/Input"
import { Button } from "@/components/Button/Button"


const ProfilePage = () => {
    return <>
        <Layout>
            <Box>
                <TextInput label='Такой то 1' small={true}/>
                <TextInput label='Такой то 2' small={true}/>
                <TextInput label='Такой то 3' small={true}/>
                <TextInput label='Такой то 4' small={true}/>
                <TextInput label='Такой то 5' small={true}/>
                <TextInput label='Такой то 6' small={true}/>
                <TextInput label='Такой то 7' small={true}/>
                <TextInput label='Такой то 8' small={true}/>
                <TextInput label='Такой то 9' small={true}/>
                <TextInput label='Такой то 10' small={true}/>
                <TextInput label='Такой то 11' small={true}/>
                <TextInput label='Такой то 12' small={true}/>
                <Button>Отправить</Button>
            </Box>
        </Layout>
    </>
}

export default ProfilePage