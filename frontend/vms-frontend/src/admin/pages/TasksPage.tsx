import { Button } from "@/shared/shad-ui/ui/button";
import {
    Table,
    TableBody,
    TableHead,
    TableHeader,
    TableRow,
} from "@/shared/shad-ui/ui/table";
import { Separator } from "@/shared/shad-ui/ui/separator";
import { Spinner } from "@nextui-org/react";
import { PaginatorObj, Task } from "@/shared/types/types";

import { Link } from "react-router-dom";
import { useHttp } from "@/shared/hooks/http-hook";
import { useEffect, useState } from "react";
import useAuth from "@/shared/hooks/useAuth";
import { useToast } from "@/shared/shad-ui/ui/use-toast";
import TaskDetails from "../components/TaskDetail";
import FadeTransition from "../components/FadeTransition";
import Paginator from "../components/Paginator";

const TasksPage = () => {
    const auth = useAuth();
    // paginator object stores data related to pagination like count, next page, prev page and page size
    const [paginationObj, setPaginationObj] = useState<PaginatorObj | null>(null);
    const [tasks, setTasks] = useState<Task[]>([]);
    const { loading, error, sendRequest, clearError } = useHttp();
    const { toast } = useToast();
    // function to retrieve data from api
    const getData = async (page: number) => {
        // get data with custom Hook
        const responseData = await sendRequest(`/api/tasks/paginated/?page=${page}`, 'get', {
            Authorization: `Bearer ${auth.tokens.access}`
        })
        if (response) {
            // set data to response result
            setTasks(responseData.results)
            if (paginationObj) {
                const updatedObj = {
                    ...paginationObj,
                    count: responseData.count,
                    next: responseData.next,
                    previous: responseData.previous
                }
                setPaginationObj(updatedObj);
            } else {
                setPaginationObj({
                    count: responseData.count,
                    page_size: Math.ceil(responseData.count / responseData.results.length),
                    next: responseData.next,
                    previous: responseData.previous
                })
            }
        }

    }
    // when conponent mounts - meaning when it is created we get data
    useEffect(() => {
        // clear error at start to get rid of any not actual previous errors
        clearError();
        getData(1);
    }, []);

    const deleteTask = async (task: Task) => {
        if (tasks) {
            const updatedList = tasks.filter((item: Task) => item.id !== task.id);
            // send data with custom Hook
            const response = await sendRequest(`/api/tasks/${task.id}`, 'delete', {
                Authorization: `Bearer ${auth.tokens.access}`
            })
            if (response) {
                toast({ title: "Tasks deleted successfully!" })
                setTasks(updatedList);
            }
        }
    }

    return (
        <>
            <div className="flex justify-between">

                <div className="flex gap-4">
                    <h1 className="text-2xl font-bold mb-4">Driver Tasks & Jobs</h1>
                    {loading && <div className="">
                        <Spinner></Spinner>
                    </div>}
                </div>
                <Link to='/admin/tasks/add'>
                    <Button variant='default'>Add Task</Button>
                </Link>
            </div>
            <Separator />
            {error ? <div className="text-red-400 mt-4 ">Error: {error}</div> : null}
            <FadeTransition show={tasks.length > 0}>

                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Driver</TableHead>
                            <TableHead>Date time</TableHead>
                            <TableHead>Assigned Vehicle</TableHead>
                            <TableHead className="text-right">Action</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {
                            tasks.map((task) => {
                                return <TaskDetails key={task.id} task={task} deleteTask={deleteTask} />
                            })
                        }

                    </TableBody>
                </Table>
                {paginationObj && <Paginator getData={getData} paginatorData={paginationObj} />}
            </FadeTransition>

        </>
    );
};

export default TasksPage;
