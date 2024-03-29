import { useHttp } from '@/shared/hooks/http-hook'
import useAuth from '@/shared/hooks/useAuth'
import { Button } from '@/shared/shad-ui/ui/button'
import { TableCell, TableRow } from '@/shared/shad-ui/ui/table'
import { useToast } from '@/shared/shad-ui/ui/use-toast'
import { Driver } from '@/shared/types/types'
import { useNavigate } from 'react-router-dom'
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure } from "@nextui-org/react";
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem } from "@nextui-org/react";

const DriverDetailRow = ({ driver, removeDriverFromList }: { driver: Driver, removeDriverFromList: (driverId: number) => void }) => {
    // get auth context to have access to currently logged in user data
    const auth = useAuth();
    // navigation component to redirect user
    const navigate = useNavigate();

    const { sendRequest, clearError } = useHttp(); // custom HTTP hook to call APIs
    const { toast } = useToast(); // toast messages library
    const { isOpen, onOpen, onOpenChange } = useDisclosure();

    const deleteDriver = async () => {
        if (driver) {
            // clear previous errors if any
            clearError();

            // delete the user through api endpoitn
            const response = await sendRequest(`/api/drivers/${driver.id}/`, 'delete', {
                Authorization: `Bearer ${auth.tokens.access}`
            })
            if (response) {
                // delete the user from current state, because even if it is deleted from database, it can still be on the page, if page is not refreshed, therefore we manually remove it from page
                removeDriverFromList(driver.id);
                toast({ title: "Driver deleted successfully" })
            }

        }
    }

    return (
        <TableRow  >
            <TableCell className="font-medium">
                {driver.name} {driver.middle_name} {driver.surname}
            </TableCell>
            <TableCell>{driver.phone}</TableCell>
            <TableCell>{driver.email}</TableCell>
            <TableCell className="text-right">
                <Dropdown>
                    <DropdownTrigger className='focus:outline-none'>
                        <Button variant="outline">
                            Open Menu
                        </Button>
                    </DropdownTrigger>
                    <DropdownMenu aria-label="Static Actions" className='text-center'>
                        <DropdownItem key="details" onClick={() => navigate(`/admin/drivers/${driver.id}/detail`)}>
                            View details
                        </DropdownItem>
                        <DropdownItem key="edit" onClick={() => navigate(`/admin/drivers/${driver.id}/edit`)}>
                            Edit
                        </DropdownItem>
                        <DropdownItem onClick={onOpen} key="delete" className="text-danger pl-4" color="danger">
                            Delete
                        </DropdownItem>
                    </DropdownMenu>
                </Dropdown>

                <Modal backdrop='blur' isOpen={isOpen} onOpenChange={onOpenChange}>
                    <ModalContent>
                        {(onClose) => (
                            <>
                                <ModalHeader className="flex flex-col gap-1">Are you absolutely sure?</ModalHeader>
                                <ModalBody>
                                    <p>
                                        This action cannot be undone. This will permanently delete {`${driver.name}'s`} account
                                        and remove all data associated with this account.<br />
                                        Specifically,
                                        <span><br />
                                            <span>- Personal information</span><br />
                                            <span>- Currently assigned tasks</span><br />
                                            <span>- Routes history</span><br />
                                            <span>- Completed tasks</span><br />
                                            <span>- Appointments</span><br />
                                        </span>
                                    </p>
                                </ModalBody>
                                <ModalFooter>
                                    <Button onClick={onClose} variant="secondary">Cancel</Button>
                                    <Button onClick={() => {
                                        onClose()
                                        deleteDriver()
                                    }} variant="destructive">Delete</Button>
                                </ModalFooter>
                            </>
                        )}
                    </ModalContent>
                </Modal>


            </TableCell>
        </TableRow>
    )
}

export default DriverDetailRow