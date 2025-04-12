import { Button } from "@/components/ui/button"
import { DataTable } from "@/components/ui/DataTable"
import { Label } from "@/components/ui/label"
import { FolderPlus, Search } from "lucide-react"
import { User } from '@/type/User'
import { faker } from '@faker-js/faker';
import ViewUserTable from "./UserTable"
import { useCallback, useEffect, useState } from "react"
import UserEditSheet from "./UserEditSheet"
import { Input } from "@/components/ui/input"

const Page = () => {
    const [users, setUsers] = useState<User[]>()
    const [currentUser, setCurrentUser] = useState<User>()
    useEffect(() => {
        getUsers().then((data) => {
            setUsers(data)
        })
    }, [])

    const [openEditSheet, setOpenEditSheet] = useState(false)
    const handleEditUser = useCallback((user: User) => {
        setCurrentUser(user)
        setOpenEditSheet(true)
    }, [])
    return (
        <>
            <UserEditSheet
                open={openEditSheet}
                user={currentUser}
                onClose={() => {
                    setOpenEditSheet(false)
                }}
            >
            </UserEditSheet>
            <div className="flex flex-col p-5 w-full gap-5">
                <div className="flex justify-between items-center w-full">
                    <div>
                        <Label className="text-2xl"> User Management</Label>
                    </div>
                </div>
                <div className="flex gap-10">
                    <Input type="text" placeholder="Type your id or name"></Input>
                    <Button> <Search> </Search></Button>
                </div>
                <div className="grow overflow-auto">
                    <ViewUserTable
                        data={users ? users : []}
                        handleSheetPreviewClicked={handleEditUser}
                    >
                    </ViewUserTable>
                </div>
            </div>
        </>
    )
}

export default Page


export async function getUsers(count: number = 100): Promise<User[]> {
    const users: User[] = [];

    for (let i = 1; i <= count; i++) {
        const dateOfBirth = faker.date.between({ from: '1970-01-01', to: '2005-12-31' });
        const createdAt = faker.date.past({ years: 5 });
        const updatedAt = faker.date.between({ from: createdAt, to: new Date() });

        users.push({
            id: i,
            name: faker.person.fullName(),
            email: faker.internet.email(),
            username: faker.internet.username(),
            passwordHash: faker.string.alphanumeric(32),
            avatarUrl: faker.image.avatar(),
            phoneNumber: faker.phone.number(),
            dateOfBirth,
            createdAt,
            updatedAt,
        });
    }

    return users;
}