from rest_framework import serializers
from accounts.models import Driver, FuelingPerson, MaintenancePerson, Admin
from vehicles.models import Vehicle, FuelingProof, MaintenanceJob, AuctionVehicle, RepairingPart, FuelingTask
from tasks.models import Appointment, Task, CompletedRoute
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from django.contrib.auth.models import User

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



class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        role = getRole(user)
        # Add custom claims
        token['username'] = user.username
        token['role'] = role
        # ...

        return token
    

# Accountss Serializers
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'first_name', 'last_name')

class AdminSerializer(serializers.ModelSerializer):
    user = UserSerializer(many=False)
    class Meta:
        model = Admin
        fields = '__all__'

class DriverSerializer(serializers.ModelSerializer):
    class Meta:
        model = Driver
        fields = '__all__'

class FuelingSerializer(serializers.ModelSerializer):
    class Meta:
        model = FuelingPerson
        fields = '__all__'

class MaintenanceSerializer(serializers.ModelSerializer):
    class Meta:
        model = MaintenancePerson
        fields = '__all__'  




# Vehicles Serializers
class VehicleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Vehicle
        fields = ['id', 'make', 'model', 'type', 'year', 'license_plate', 'capacity', 'mileage', 'status']


class AuctionVehicleSerializer(serializers.ModelSerializer):
    class Meta:
        model = AuctionVehicle
        fields = ['id', 'make', 'model', 'type', 'year', 'license_plate', 'capacity', 'mileage', 'image', 'condition', 'additional_information']


class FuelingProofSerializer(serializers.ModelSerializer):
    vehicle = VehicleSerializer(many=False)

    class Meta:
        model = FuelingProof
        fields = '__all__'

class MaintenanceJobSerializer(serializers.ModelSerializer):
    vehicle = VehicleSerializer(many=False)
    maintenance_person = MaintenanceSerializer(many=False)

    class Meta:
        model = MaintenanceJob
        fields = '__all__'

class RepairPartsSerializer(serializers.ModelSerializer):

    class Meta:
        model = RepairingPart
        fields = '__all__'

# Tasks Serializers
class AppointmentSerializer(serializers.ModelSerializer):
    driver = DriverSerializer(many=False)
    class Meta:
        model = Appointment
        fields = '__all__'

class TaskSerializer(serializers.ModelSerializer):
    driver = DriverSerializer(many=False)
    car = VehicleSerializer(many=False)
    class Meta:
        model = Task
        fields = '__all__'

class CompletedRouteSerializer(serializers.ModelSerializer):
    driver = DriverSerializer(many=False)
    vehicle = VehicleSerializer(many=False)

    class Meta:
        model = CompletedRoute
        fields = '__all__'



class FuelingTaskSerializer(serializers.ModelSerializer):
    vehicle = VehicleSerializer(many=False)
    class Meta:
        model = FuelingTask
        fields = '__all__'

