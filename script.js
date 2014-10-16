
$(function(){
	var commitCount = 0;

	var eventAPICallForUserNameAndPageNumber = function(name, pageNumber) {
		var githubApiCall = 'https://api.github.com/users/'+name+'/events/public?page=' + pageNumber;
		return $.ajax({ url: githubApiCall }).success(function(response){
			var pushEvents = filterEventsByType(response, 'PushEvent')
			getNumberOfCommitsFor(pushEvents);
		});
	};

	var filterEventsByType = function(events, eventType){
		var filterEvents = []
		$.grep(events, function(n) {
				 if (n['type'] === eventType){
				 	filterEvents.push(n)
				 };
			});	
		return filterEvents
	};



	var getNumberOfCommitsFor = function(githubEvents)
	{
		githubEvents.forEach(function(githubEvent){
				var commits = githubEvent.payload.commits.length;
				commitCount += commits;
				console.log(githubEvent, commits);
			});	
	};

	var getNumberOfPushCommitsForUser = function(userName){
		var deferredObjects = [];
	for (var pageNumber = 1; pageNumber <= 10; pageNumber++){
		deferredObjects.push(eventAPICallForUserNameAndPageNumber(userName, pageNumber));
		}
		return deferredObjects
	};

	$.when.apply($, getNumberOfPushCommitsForUser('zachlysobey')).done(function(){
		alert(commitCount);
	});

});