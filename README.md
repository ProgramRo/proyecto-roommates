# PROYECTO ROOMMATES
## Descripción
Es bien sabido que entre las mejores recomendaciones que un programador amateur puede recibir para mejorar sus habilidades es “crear aplicaciones”, sin darle tanta importancia a la temática a elaborar, sino que solo basta con un problema para desarrollar una solución digital.
En esta prueba deberás crear un servidor con Node que sirva una interfaz HTML que tendrás a disposición en el Apoyo Prueba - Roommates y cuya temática está basada en el registro de gastos entre roommates.

Además deberás servir una API REST que permita hacer lo siguiente:    

    ● Almacenar roommates nuevos ocupando random user.    
    ● Devolver todos los roommates almacenados.    
    ● Registrar nuevos gastos.    
    ● Devolver el historial de gastos registrados.    
    ● Modificar la información correspondiente a un gasto.    
    ● Eliminar gastos del historial.    
    
A continuación se muestra una imagen con la interfaz que deberás devolver en la ruta raíz del servidor:
![image](https://user-images.githubusercontent.com/98556305/169445439-be509fca-31ec-48ce-9412-ce2bb1404e25.png)

Rutas que debes crear en tu servidor:    
        ● / GET: Debe devolver el documento HTML disponibilizado en el apoyo.    
        ● /roommate POST: Almacena un nuevo roommate ocupando random user.    
        ● /roommate GET: Devuelve todos los roommates almacenados.    
        ● /gastos GET: Devuelve el historial con todos los gastos registrados.    
        ● /gasto PUT: Edita los datos de un gasto.    
        ● /gasto DELETE: Elimina un gasto del historial.    

