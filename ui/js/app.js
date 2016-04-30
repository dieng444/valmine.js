$(document).ready(function() {

  init();

  function init() { //Fonction d'initialisation
    $("#album-form").hide(); //Les formulaires sont cachés au lancement de la page
    $("#btn-add-album").click(function(){ //Affichage des formulaires
      $("#album-form").fadeToggle("fast","linear");
    });
    $("#icone-menu").click(function() { //Affichage du menu déroulant en mode mobile
      $("#navigations").fadeToggle("slow","linear");
    });
    /*$("#navigations nav li").each(function(){
      $(this).click(function(){
        $(this).css("background-color",'rgb(18, 143, 220)');
      });
    });*/
    $(".deleteImage").each(function() { //Suppression des images
      $(this).click(function() {
        var question = confirm('Voulez vous vraiment supprimer cette image ?')
          , obj = $(this)
          , bucketName = $('input[name="bucketName"]').val()
          , albumName = $('input[name="albumName"]').val()
          , imageId = $(this).next().val()
          , url = '/image/delete/'+imageId+'/'+bucketName+'/'+albumName;

        if(question) {
          ajaxSend(url, function(statusCode){
            if(statusCode==200)
              obj.parent().parent().parent().remove(); //Suppression du blcok contenant l'image
          });
        }
      });
    });
    validateForm("#login-form");
    validateForm("#signup-form");
    validateForm("#album-form");
  }
  /**
	 * Function permettant de gérer les formulaires
	 * @param form : le formulaire à valider
	 */
	function validateForm(form)
	{
		$(form).submit(function(event){
			var isErrorTrigger = false;
			$('.form-child').each(function(){
				if(($(this).attr('type')=="text" || $(this).get(0).nodeName=="TEXTAREA"
					|| $(this).attr('type')=="password" || $(this).get(0).nodeName=="SELECT")
					&& $(this).val()=="")
				{
					$(this).next().show();
					isErrorTrigger = true;
				}
				else if($(this).val()!="") $(this).next().hide();
			});
			if(isErrorTrigger) event.preventDefault();
		});
	}
  function resultManager(data, ss, xhr) {
    if(xhr.status == 200) $('.alert-success').fadeIn('slow','linear');
    else $('.alert-dange').show('slow','linear');
  }
  /**
   * Permet d'effectuer des opérations sur le serveur
   * @param {string} url - l'url à intérroger côté serveur
   */
  function ajaxSend (url, callback) {
  		$.ajax({
  			  url: url,
  			  type: "GET",
  			  dataType: "json",
          statusCode : {200: callback(200)}
  		}).success(resultManager);
  }
});
