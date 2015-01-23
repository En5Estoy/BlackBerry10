define(['underscore', 'bbui', 'jquery', 'jquery_depend'], function(_, bb, $) {

	return {
		showMessage : function(title, message) {
			if( _.isUndefined( blackberry.ui ) ) {
				alert(message);
			} else {
				blackberry.ui.dialog.standardAskAsync(message, blackberry.ui.dialog.D_OK, function(){}, {title : title});
			}
		},

		showToast : function(message) {
			blackberry.ui.toast.show(message);
		},

		showAsk : function(title, message, callback) {
			blackberry.ui.dialog.standardAskAsync(message, blackberry.ui.dialog.D_YES_NO, callback, {title : title, size: blackberry.ui.dialog.SIZE_MEDIUM, position : blackberry.ui.dialog.TOP});
		},

		showLoading : function() {
			if( $('.loader-dialog').is(':empty') ) {
				bb.activityIndicator.apply(document.getElementsByClassName('loader-dialog'));
			}
			
			var child = $('.loader-dialog').children();

			var percW = ((child.width() * 100) / $(document).width()) / 2;
			var percH = ((child.height() * 100) / $(document).height()) / 2;

			$(".loader-dialog").css('position', 'fixed').css('left', (50 - percW) + '%').css('top', (50 - percH) + '%').css('z-index', '99999999');

			$(".loader-dialog").show();
		},

		hideLoading : function() {
			$(".loader-dialog").hide();	
		}
	};
	
});