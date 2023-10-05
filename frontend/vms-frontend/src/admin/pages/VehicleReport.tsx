import { useHttp } from '@/shared/hooks/http-hook';
import useAuth from '@/shared/hooks/useAuth';
import { Separator } from '@/shared/shad-ui/ui/separator';
import { useToast } from '@/shared/shad-ui/ui/use-toast';
import { Vehicle } from '@/shared/types/types';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import FuelingGraph from '../components/graphs/FuelingGraph';
import { Spinner } from '@nextui-org/react';


const VehicleReport = () => {
    // get vehicle id from url using useParams hook from react
    const vehicleId = useParams().vid;
    // get auth context to access currently logged in user data
    const auth = useAuth();
    // states to store vehicle data 
    const [vehicle, setVehicle] = useState<Vehicle>();
    // custom hook to make API calls
    const { loading, error, sendRequest, clearError } = useHttp();
    // library to show toast messagess
    const { toast } = useToast();

    // retrieve data from api
    const getData = async () => {
        // clear error at start to get rid of any not actual previous errors
        clearError();
        // try and catch to catch errors if any
        try {
            // get data with custom Hook
            const vehicleData = await sendRequest(`/api/vehicles/${vehicleId}/`, 'get', {
                Authorization: `Bearer ${auth.tokens.access}`
            })
            // set data to response result
            setVehicle(vehicleData);
        } catch (err: any) {
            console.log(err)
            // show error toast message
            toast({
                title: err.message,
                variant: "destructive",
            })
        }
    }

    // call getData when vehicleId from url changes to always have accurate data
    useEffect(() => {
        if (vehicleId) {
            getData();
        }
    }, [vehicleId]);



    return (
        <>
            {loading ? <Spinner /> : <div className='w-full h-full flex flex-col'>
                <h1 className="text-2xl font-bold mr-4">{vehicle?.make} {vehicle?.model} {vehicle?.year}</h1>
                <Separator />
                {error ? <div className="flex justify-center">
                    <span className="text-red-500 justify-self-center">{error}</span>
                </div> : null}
                {vehicleId && <FuelingGraph vehicleId={parseInt(vehicleId)} />}
            </div>}
        </>
    )
}

export default VehicleReport