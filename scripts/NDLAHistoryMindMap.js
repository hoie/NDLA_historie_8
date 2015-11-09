NDLAHistoryMindMap = (function () {
   var historyNodes;
   var historyLinks;
   var storageId;
   var title;
   var percent = 0;
   var nodes = 0;
   var links = 0;
 
    function init(_storageId, _title) {
	   historyNodes = [];
       historyLinks = [];
       storageId = _storageId;
       title = _title;
       // updatePercent();
       // console.log(percent+" %");
	}
	function updatePercent() {
		var notes = 0;
		for (var i=1; i<=nodes; i++) {
			var n = loadNote("n"+i);
			if (n) {
				notes +=1;
				nodeOrLinkByHtmlId("n"+i).note = n;
			}
		}
		for (var i=1; i<=links; i++) {
			var n = loadNote("l"+i);
			if (n) {
				notes +=1;
				nodeOrLinkByHtmlId("l"+i).note = n;
			}
		}
		percent = Math.round(100* notes / (nodes+links));
		document.getElementById("percent").innerHTML = percent+"%";
		document.getElementById("progress-bar").style.width = percent+"%";
	}
	function deleteNotes() {
		var r = confirm("Er du sikker på at du vil slette alle notatene dine tilhørende '"+title+"'?");
		if (r == true) {
    for (var i=1; i<=nodes; i++) {
			saveNote("n"+i,"");
			document.getElementById("n"+i).className = "node n" + i;
		}
		for (var i=1; i<=links; i++) {
			saveNote("l"+i,"");
			if (document.getElementById("l"+i).className.search("double-arrow")===-1) {
				document.getElementById("l"+i).className = "link l" + i;
			} else {
				document.getElementById("l"+i).className = "link double-arrow l" + i;
			}
		}
			updatePercent();
			updateNodes();
			updateLinks();
		} else {
		   console.log("Cancel");
		}
		
	}
	function showHelp() {
		var text = "<h1>Hjelp</h1><p>Formålet med denne oppgaven er å forbedre læringen din ved å knytte dine egne notater opp mot et tankekart. Tankekartet består av hendelser (bokser) og sammenhenger (piler). Du skal legge inn notater til både hendelser og sammenhenger.</p><p>Trykk på <button class='edit'>✎</button> for å legge til et notat til en hendelse eller en sammenheng. Notatene du skriver inn blir automatisk lagret lokalt i nettleseren på datamaskinen du bruker, slik at du kan fortsette på eller lee notatene på et senere tidspunkt.</p><p>Progresjonsmåleren nede til venstre viser hvor mange prosent av hendelsene og sammenhengene som har fått notater. 100% betyr at du har lagt inn notater på alle tilgjengelige steder.</p><p><button>Eksportér notater</button> gir deg en oversikt over alle notatene du har skrevet. Der kan du printe ut eller kopiere notatene for å f.eks lime dem inn i et dokument eller en epost.</p><p><button>Slett alle notater</button> sletter alle notatene fra nettleseren på datamaskinen du bruker.</p>";
		document.getElementById("help-wrapper").className = "active";
		document.getElementById("help-container").innerHTML = text;
	}
	function exportText() {
		var text = "<h1>"+title+"</h1>";
		for (var i=1; i<=nodes; i++) {
			text = text+"<h2><button class='edit' onclick=\"showNodeNote('"+historyNodes[i-1].htmlId+"');\">✎</button>"+historyNodes[i-1].title+"</h2>";
			var n = loadNote("n"+i);
			if (n) {
				text = text+"<p>"+n+"</p>";
			} else {
				text = text+"<p><i>--- Mangler notater!</i></p>";
			}
		}
		for (var i=1; i<=links; i++) {
			var n = loadNote("l"+i);
			console.log(historyLinks[i-1]);
			var arrow = "&rarr;";
			if (historyLinks[i-1].twoWay) {
				arrow = "&harr;";
			}
			text = text+"<h2><button class='edit' onclick=\"showLinkNote('"+historyLinks[i-1].htmlId+"');\">✎</button>"+historyLinks[i-1].fromNode.title+" "+arrow+" "+historyLinks[i-1].toNode.title+"</h2>";
			if (n) {
				text = text+"<p>"+n+"</p>";
			} else {
				text = text+"<p><i>--- Mangler notater!</i></p>";

			}
		}
		document.getElementById("export-wrapper").className = "active";
		document.getElementById("export-container").innerHTML = text;
	}
    function createNode(title, subtitle, url, htmlId) {
        historyNodes.push(HistoryNode(historyNodes.length, title, subtitle, url, htmlId));
        nodes +=1;
        return historyNodes[nodes-1];
    }
    function HistoryNode(id, title, subtitle, url, htmlId) {
        return {id:id, title:title, subtitle:subtitle, url:url, htmlId:htmlId, links:[], note:""};
    }
    function createLink(fromNode,toNode,twoWay, subtitle, url, htmlId) {
        historyLinks.push(HistoryLink(historyLinks.length,fromNode,toNode,twoWay, subtitle, url, htmlId));
        links +=1;
        return historyLinks[links-1];
    }
    function HistoryLink(id, fromNode, toNode, twoWay, subtitle, url, htmlId) {
        return {id:id, fromNode:fromNode, toNode:toNode, twoWay:twoWay, subtitle:subtitle, url:url, htmlId:htmlId, note:""};
    }
    function saveNote(id,note) {
	    localStorage.setItem(storageId+"_"+id,note);
	    nodeOrLinkByHtmlId(id).note= note;
	    updatePercent();
	    updateNodes();
	    updateLinks();
    }
    function loadNote(id){
	    var n = localStorage.getItem(storageId+"_"+id);
	    if (n=="null" || n==null || n==undefined) {
		    n = "";
	    }
	    return n;
    }
    function updateNode(node) {
	    document.getElementById(node.htmlId+"title").innerHTML = node.title;
	    if (node.note=="") {
		    document.getElementById(node.htmlId+"subtitle").innerHTML = node.subtitle;
		    } else {
			    document.getElementById(node.htmlId+"subtitle").innerHTML = node.subtitle;
			    if (document.getElementById(node.htmlId).className.search("hasNote")===-1) {
			    	document.getElementById(node.htmlId).className =  document.getElementById(node.htmlId).className+" hasNote";
			    }
		    }
	    document.getElementById(node.htmlId+"url").innerHTML = node.url;
    }
    function updateLink(link) {
	    var arrow = "&rarr;";
			if (link.twoWay) {
				arrow = "&harr;";
			}
	    document.getElementById(link.htmlId+"title").innerHTML = link.fromNode.title+" "+arrow+" "+link.toNode.title;
	    if (link.note=="") {
		    document.getElementById(link.htmlId+"subtitle").innerHTML = link.subtitle;
		    } else {
			    document.getElementById(link.htmlId+"subtitle").innerHTML = link.subtitle;
			    if (document.getElementById(link.htmlId).className.search("hasNote")===-1) {
			    	document.getElementById(link.htmlId).className =  document.getElementById(link.htmlId).className+" hasNote";
			    }
		    }
	    document.getElementById(link.htmlId+"url").innerHTML = link.url;
    }
    function updateNodes() {
	    updatePercent();
	    for (var i=0; i<historyNodes.length; i++) {
		    updateNode(historyNodes[i]);
	    }  
    }
    function updateLinks() {
	    updatePercent();
	     for (var i=0; i<historyLinks.length; i++) {
		    updateLink(historyLinks[i]);
	    } 
	    
    }
    function nodeOrLinkByHtmlId(htmlId) {
	     for (var i=0; i<historyNodes.length; i++) {
		    if (historyNodes[i].htmlId===htmlId) {
			    return historyNodes[i];
		    }
	    }
	    for (var i=0; i<historyLinks.length; i++) {
		    if (historyLinks[i].htmlId===htmlId) {
			    return historyLinks[i];
		    }
	    } 
	    return null;
    }
    
    return {
        init:init,
        createNode:createNode,
        createLink:createLink,
        saveNote:saveNote,
        loadNote:loadNote,
        exportText:exportText,
        updateNodes:updateNodes,
        updateLinks:updateLinks,
        showHelp:showHelp,
        deleteNotes:deleteNotes
          };
})();