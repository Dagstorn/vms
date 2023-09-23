from datetime import datetime
from django.shortcuts import get_object_or_404
from django.utils import timezone
import pytz
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.exceptions import ValidationError
from rest_framework import status
from .serializers import DriverSerializer, VehicleSerializer, AppointmentSerializer, TaskSerializer
from accounts.models import Driver
from vehicles.models import Vehicle
from tasks.models import Appointment, Task
from rest_framework.permissions import IsAuthenticated, IsAdminUser

def do_time_windows_overlap(time_start1, time_end1, time_start2, time_end2):
    # Convert the time strings to datetime objects
    start1 = datetime.strptime(time_start1, "%Y-%m-%dT%H:%M")
    end1 = datetime.strptime(time_end1, "%Y-%m-%dT%H:%M")
    start2 = datetime.strptime(time_start2, "%Y-%m-%dT%H:%M")
    end2 = datetime.strptime(time_end2, "%Y-%m-%dT%H:%M")

    # selected time is 
        # 24.09 from 14:00 to 16:00
    ## time is 24.09 from 15:00 to 18:00


    # Check if time window 2 starts before time window 1 ends
    # and if time window 2 ends after time window 1 starts
    if start2 < end1 and end2 > start1:
        return True
    else:
        return False
def getRole(user):
    if hasattr(user, 'admin_acc'):
        role = "admin"
    elif hasattr(user, 'driver_acc'):
        role = "driver"
    elif hasattr(user, 'fueling_acc'):
        role = "fueling"
    elif hasattr(user, 'maintenance_acc'):
        role = "maintenance"
    else:
        role = "default1"

    return role

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getDriver(request):
    if getRole(request.user) != 'driver':
        raise ValidationError("You don't have correct role to make an API call", code=status.HTTP_400_BAD_REQUEST)
    driver = request.user.driver_acc
    serializer = DriverSerializer(driver, many=False)
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getDrivers(request):
    if getRole(request.user) != 'admin':
        raise ValidationError("You don't have correct role to make an API call", code=status.HTTP_400_BAD_REQUEST)
    drivers = Driver.objects.all()
    serializer = DriverSerializer(drivers, many=True)
    return Response(serializer.data)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getVehicles(request):
    if getRole(request.user) != 'admin':
        raise ValidationError("You don't have correct role to make an API call", code=status.HTTP_400_BAD_REQUEST)
    vehicles = Vehicle.objects.all()
    serializer = VehicleSerializer(vehicles, many=True)
    return Response(serializer.data)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getAppointments(request):
    appointments = Appointment.objects.all()
    serializer = AppointmentSerializer(appointments, many=True)
    return Response(serializer.data)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def makeAppointment(request):
    if getRole(request.user) != 'driver':
        raise ValidationError("You don't have correct role to make an API call", code=status.HTTP_400_BAD_REQUEST)

    try:
        new_appointment = Appointment.objects.create(
            currentPosition = request.data.get('currentPosition'),
            destination = request.data.get('destination'),
            description = request.data.get('description'),
            car_type = request.data.get('carPereferences'),
            time_from = request.data.get('startDate'),
            time_to = request.data.get('endDate'),
            additionalInfo = request.data.get('additionalInfo'),
            number_of_people = request.data.get('numberOfPeople'),
            driver = request.user.driver_acc,
        )
    except:
        raise ValidationError("Wrong data format or missing data", code=status.HTTP_400_BAD_REQUEST)
    serializer = AppointmentSerializer(new_appointment, many=False)
    return Response(serializer.data)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def getTimes(request):
    if getRole(request.user) != 'admin':
        raise ValidationError("You don't have correct role to make an API call", code=status.HTTP_400_BAD_REQUEST)
    t1 = request.data.get('startTime')
    t2 = request.data.get('endTime')
    # t1 = "2023-09-24T14:00"
    # "2023-09-24 09:00:00+00:00"
    # t2 = "2023-09-24T16:00"
    drivers = Driver.objects.all()
    res = []
    for d in drivers:
        for t in d.tasks.all():
            t3 = t.time_from.astimezone(pytz.timezone('Asia/Almaty')).replace(microsecond=0).strftime('%Y-%m-%dT%H:%M')
            t4 = t.time_to.astimezone(pytz.timezone('Asia/Almaty')).replace(microsecond=0).strftime('%Y-%m-%dT%H:%M')
 
            if do_time_windows_overlap(t1, t2, str(t3),str(t4)):
                print("found one")
                res.append({
                    'driver': d.id,
                    'car': t.car.id
                })

    return Response(res)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def createTask(request):
    if getRole(request.user) != 'admin':
        raise ValidationError("You don't have correct role to make an API call", code=status.HTTP_400_BAD_REQUEST)

    try:
        driver_id = request.data.get('driver')
        driver_obj = Driver.objects.get(id=driver_id)
        veh_id = request.data.get('car')
        vehicle = Vehicle.objects.get(id=veh_id)

        input_datetime1 = datetime.strptime(request.data.get('startDate'), "%Y-%m-%dT%H:%M")
        input_datetime2 = datetime.strptime(request.data.get('endDate'), "%Y-%m-%dT%H:%M")
        new_task = Task.objects.create(
            driver=driver_obj,
            car=vehicle,
            description=request.data.get('description'),
            from_point=request.data.get('from_point'),
            to_point=request.data.get('to_point'),
            time_from=timezone.make_aware(input_datetime1, timezone.get_current_timezone()),
            time_to=timezone.make_aware(input_datetime2, timezone.get_current_timezone()),
        )

    except:
        raise ValidationError("Wrong data format or missing data", code=status.HTTP_400_BAD_REQUEST)
    
    
    serializer = TaskSerializer(new_task, many=False)
    return Response(serializer.data)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getTasks(request):
    if getRole(request.user) != 'admin':
        raise ValidationError("You don't have correct role to make an API call", code=status.HTTP_400_BAD_REQUEST)
    tasks = Task.objects.all()
    serializer = TaskSerializer(tasks, many=True)
    return Response(serializer.data)

