import { Task } from "@/shared/types/types";
import { formatTimeRange } from "@/shared/utils/utils";
import { TableCell, TableRow } from "@/shared/shad-ui/ui/table";
import { Button } from "@/shared/shad-ui/ui/button";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure } from "@nextui-org/react";
import { Chip } from "@nextui-org/react";
import { useJsApiLoader } from "@react-google-maps/api";
import { useEffect, useState } from "react";
import { Timeline, Flowbite } from 'flowbite-react';
import type { CustomFlowbiteTheme } from 'flowbite-react';
interface Props {
    task: Task
}

const customTheme: CustomFlowbiteTheme = {
    timeline: {
        item: {
            point: {
                marker: {
                    base: {
                        vertical: "absolute -left-1.5 mt-1.5 h-3 w-3 rounded-full border-2 border-gray bg-blue-400"
                    },
                }
            },
            content: {
                title: "text-xl-3 font-bold text-blue-500"
            },
        },

    }
};

const TaskDetails = ({ task }: Props) => {
    // modal window for task details
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const [fromPoint, setFromPoint] = useState("");
    const [toPoint, setToPoint] = useState("");
    // google maps api to translate location coordinates to actual location name
    const { isLoaded } = useJsApiLoader({
        googleMapsApiKey: import.meta.env.VITE_REACT_GOOGLE_MAPS_API!,
        libraries: ['places']
    })
    useEffect(() => {
        const getRoute = () => {
            const geocoder = new google.maps.Geocoder;
            const point1 = JSON.parse(task.from_point);
            const point2 = JSON.parse(task.to_point);
            geocoder.geocode({ location: point1 })
                .then(async (response: any) => {

                    setFromPoint(response.results[0].formatted_address)
                })
            geocoder.geocode({ location: point2 })
                .then(async (response: any) => {
                    setToPoint(response.results[0].formatted_address)
                })
        }
        if (isLoaded) {
            getRoute();
        }
    })
    const getStatus = () => {
        if (task.status === "Assigned") {
            return <Chip color="warning">{task.status}</Chip>
        } else if (task.status === "In progress") {
            return <Chip color="secondary">{task.status}</Chip>
        } else if (task.status === "Completed") {
            return <Chip color="success">{task.status}</Chip>
        }
        return <Chip color="danger">No status?</Chip>
    }
    return (
        <TableRow key={task.id}>
            <TableCell className="font-medium">{task.driver.name} {task.driver.surname}</TableCell>
            <TableCell> {formatTimeRange(task.time_from, task.time_to)}</TableCell>
            <TableCell>{`${task.car.make} ${task.car.model} ${task.car.year}`}</TableCell>
            <TableCell className="text-right">
                <Button variant="outline" onClick={onOpen} >View details</Button>
            </TableCell>
            <Modal size="xl" isOpen={isOpen} onOpenChange={onOpenChange}>
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1">
                                <span>Task for {task.driver.name} {task.driver.surname} {getStatus()}</span>
                            </ModalHeader>
                            <ModalBody>
                                <div className="flex flex-col text-base">
                                    <span><b>Time: </b>{formatTimeRange(task.time_from, task.time_to)}</span>
                                    <span><b>Vehicle: </b>{`${task.car.make} ${task.car.model} ${task.car.year}`}</span>
                                    <span><b>Description: </b>{task.description}</span>
                                    <span ><b>Route: </b></span>
                                    <Flowbite theme={{ theme: customTheme }}>
                                        <Timeline className="mb-0 mt-1 ml-1 text-base">
                                            <Timeline.Item className="mb-0">
                                                <Timeline.Point />
                                                <Timeline.Content>
                                                    <Timeline.Title className="text-base">
                                                        {fromPoint}
                                                    </Timeline.Title>
                                                </Timeline.Content>
                                            </Timeline.Item>
                                            <Timeline.Item className="mb-0">
                                                <Timeline.Point />
                                                <Timeline.Content>
                                                    <Timeline.Title className="text-base">
                                                        {toPoint}
                                                    </Timeline.Title>
                                                </Timeline.Content>
                                            </Timeline.Item>
                                        </Timeline>
                                    </Flowbite>
                                </div>
                            </ModalBody>
                            <ModalFooter>
                                <Button color="danger" variant="ghost" onClick={onClose}>
                                    Close
                                </Button>
                                <Button color="primary" onClick={onClose}>
                                    Edit Task
                                </Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </TableRow>
    )
}

export default TaskDetails