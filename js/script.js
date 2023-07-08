document.addEventListener("DOMContentLoaded", function() {
  var activitiesList = document.getElementById("activities-list");
  var storedActivities = JSON.parse(localStorage.getItem("activities")) || [];
  if (storedActivities.length === 0) {
    loadActivities();
  } else {
    displayActivities(storedActivities);
  }

  var activityForm = document.getElementById("activity-form");
  activityForm.addEventListener("submit", function(event) {
    event.preventDefault();

    var actividadInput = document.getElementById("actividad");
    var descriptionInput = document.getElementById("description");
    var actividad = actividadInput.value;
    var description = descriptionInput.value;

    addActivity(actividad, description);

    actividadInput.value = "";
    descriptionInput.value = "";
  });


  function loadActivities() {
    var XML = new XMLHttpRequest();
    XML.open("GET", "api/actividades.json", true);
    XML.onload = function() {
      if (XML.status === 200) {
        var activities = JSON.parse(XML.responseText);
        displayActivities(activities);
        updateLocalStorage(activities);
      }
    };
    XML.send();
  }

  function addActivity(actividad, description) {
    var newActivity = {
      "titulo": actividad,
      "descripcion": description
    };

    var activities = JSON.parse(localStorage.getItem("activities")) || [];
    activities.push(newActivity);

    displayActivities(activities);
    updateLocalStorage(activities);
  }

  function updateLocalStorage(activities) {
    localStorage.setItem("activities", JSON.stringify(activities));
  }

  function displayActivities(activities) {
    activitiesList.innerHTML = "";

    activities.forEach(function(activity) {
      var listItem = document.createElement("li");
      listItem.innerHTML =  activity.titulo  +  "<br>" + activity.descripcion +  "<br><br>";

      var editButton = document.createElement("button-modify");
      editButton.innerText = "Modificar";
      editButton.addEventListener("click", function() {
        var newTitle = prompt("Nuevo título:", activity.titulo);
        var newDescription = prompt("Nueva descripción:", activity.descripcion);

        if (newTitle && newDescription) {
          activity.titulo = newTitle;
          activity.descripcion = newDescription;
          displayActivities(activities);
          updateLocalStorage(activities); 
        }
      });
      listItem.appendChild(editButton);

      var deleteButton = document.createElement("button-delete");
      deleteButton.innerText = "Eliminar";
      deleteButton.addEventListener("click", function() {
        var confirmDelete = confirm("¿Estás seguro de eliminar esta actividad?");

        if (confirmDelete) {
          activities.splice(activities.indexOf(activity), 1);
          displayActivities(activities);
          updateLocalStorage(activities);
        }
      });
      listItem.appendChild(deleteButton);

      activitiesList.appendChild(listItem);
    });
  }

});
