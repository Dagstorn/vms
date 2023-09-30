from rest_framework import serializers
from accounts.models import Driver
from vehicles.models import Vehicle
from tasks.models import Appointment, Task, CompletedRoutes
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView


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
    
class DriverSerializer(serializers.ModelSerializer):
    class Meta:
        model = Driver
        fields = '__all__'

    
class VehicleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Vehicle
        fields = '__all__'

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
    class Meta:
        model = CompletedRoutes
        fields = '__all__'