import { useHttp } from "@/shared/hooks/http-hook";
import useAuth from "@/shared/hooks/useAuth";
import { Separator } from "@/shared/shad-ui/ui/separator"
import { AuctionVehicle } from "@/shared/types/types";
import { useEffect, useState } from "react";
import AuctionVehicleCard from "../components/AuctionVehicleCard";
import FadeTransition from "../components/FadeTransition";
import { Button } from "@/shared/shad-ui/ui/button";
import { Link } from "react-router-dom";
import { Plus, PlusCircle } from "lucide-react";

const Auction = () => {
    const auth = useAuth();
    const { loading, error, sendRequest, clearError } = useHttp();

    const [vehicles, setVehicles] = useState<AuctionVehicle[]>([]);

    useEffect(() => {
        const getData = async () => {
            const response = await sendRequest(`/api/auction/`, 'get', {
                Authorization: `Bearer ${auth.tokens.access}`
            })
            if (response) {
                setVehicles(response);
            }
        }
        getData();
    }, [])

    return (
        <>
            <FadeTransition show={vehicles.length > 0}>

                <div className="flex justify-between items-center mb-2">
                    <h1 className="text-2xl font-bold">Auction Vehicles </h1>
                    <Link to="/admin/auction/add/"><Button><Plus className="w-5 mr-1" />Add Vehicle</Button></Link>
                </div>
                <Separator></Separator>
                {vehicles && <div className="grid gap-6 mt-5">
                    {vehicles.map((vehicle) => <AuctionVehicleCard key={vehicle.id} vehicle={vehicle} />)}
                </div>}
            </FadeTransition>

        </>
    )
}

export default Auction