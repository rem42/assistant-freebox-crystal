var request = require('request-promise-native');
var fs = require('fs');
var path = require('path');
var PromiseChain = function(arr, fct) {
	var dfd = Promise.resolve();
	var res = arr.map(function(a, idx) {
		dfd = dfd.then(function() {
			return fct(a,idx)
		});
		return dfd
	});
	return Promise.all(res)
}

var AssistantFreeboxCrystal = function(configuration) {
	this.config = configuration;
}

AssistantFreeboxCrystal.prototype.init = function(plugins) {
	var _this=this;
	var chainesFileName = 'chaines_'+(_this.config.use_Chaines_CANAL?'canal':'free')+'.json';
	var chainesFilePath = path.join(__dirname,chainesFileName);
	_this.plugins = plugins;
	return _this.checkConfiguration()
		.then(function() {
			// url pour accéder au Freebox Player
			_this.config.player_name = _this.config.player_name || "Freebox%20Player";
			_this.config.player_ip = _this.config.player_ip || (_this.config.box_to_control||"hd1")+'.freebox.fr';
			_this.playerURL = 'http://'+_this.config.player_ip+'/pub/remote_control?code='+_this.config.code_telecommande;

			// récupération des entities
			_this.htmlEntities = require("./entities");
			_this.chaines = {}; // pour enregistrer le nom de chaine -> numéro de chaine
			// on regarde si on a une copie locale
			try {
				fs.accessSync(chainesFilePath, fs.constants.R_OK)
				var stat = fs.statSync(chainesFilePath);
				// on regarde si ça fait plus d'un mois depuis la dernière mise à jour
				var timelaps = Date.now()-stat.mtime.getTime();
				if (timelaps > 2419200000) throw "Rafraichissement des chaines via le Web";
				else {
					_this.chaines = require('./'+chainesFileName);
					return false;
				}
			} catch(err) {
				// on récupère les chaines Free
				console.log("[assistant-freebox-crystal] Récupération des chaines télé...");
				var url = (_this.config.use_Chaines_CANAL ? 'https://assistant.kodono.info/freebox.php?param=canalsat' : 'http://www.free.fr/freebox/js/datas/tv/jsontv.js?callback=majinboo&_='+Date.now());
				return request({
					url:url,
					agentOptions:{ "rejectUnauthorized":false }
				})
					.catch(function() {
						try {
							_this.chaines = require('./chaines.json');
						} catch(err) {
							console.log("[assistant-freebox-crystal] ERREUR : Impossible de récupérer la liste des chaines...");
						}
						return null
					})
			}
		})
		.then(function(response) {
			if (response) {
				// on va lire le fichier replace_chaine.json qui permet de substituer certaines chaines
				var substitution = require("./replace_chaine");

				// puis on s'occupe de la réponse du serveur
				var body =response.slice(9).replace(/\)\W+$/,"");
				body = JSON.parse(body);
				var i, chaines=[], nom, canal, slash;
				for (i=0, len=body.chaines.length; i<len; i++) {
					nom = _this.decodeEntities(body.chaines[i].nom);
					// on remplace certains noms
					nom = nom.toLowerCase().replace(/ la chaine/,"").replace(/\+/g," plus ").replace(/\s+/g," ").replace(/canal plus/,"canal +").replace(/&/g," et ").replace(/\!/g,"").trim();
					slash = nom.indexOf('/');
					if (slash > -1) nom = nom.slice(0,slash);
					nom = nom.replace(/\s+$/,"").replace(/\s(\d)/g,"$1");
					// on fait la substitution
					if (substitution[nom]) nom=substitution[nom];
					if (!nom) continue;
					canal = body.chaines[i].canal;
					_this.chaines[nom] = canal;
				}
				// chaines manquantes
				_this.chaines["canal +"]="4";
				_this.chaines["mosaïque"]=_this.chaines["la zéro"]="0";
				// on écrit dans le fichier local
				fs.writeFileSync(chainesFilePath, JSON.stringify(_this.chaines, null, 2));
			}

			if (response!==null) console.log("[assistant-freebox-crystal] Récupération des chaines terminée !");
			return _this;
		})
}
/**
 * Permet de convertir des caractères HTML en leur équivalent (par exemple "&eacute;"" devient "é")
 *
 * @param  {String} str
 * @return {String} Le résultat
 */
AssistantFreeboxCrystal.prototype.decodeEntities=function(str) {
	var _this=this;
	var mtch = str.match(/&([^;]+);/g);
	if (mtch) {
		mtch.forEach(function(s) {
			var res = s.slice(1,-1);
			if (res.charAt(0) !== "#") res=_this.htmlEntities[res];
			else res = String.fromCharCode(res.slice(1));
			var regex = new RegExp(s, "g")
			str = str.replace(regex,res);
		})
	}
	return str;
}

/**
 * Va effectuer des vérifications dans la configuration
 */
AssistantFreeboxCrystal.prototype.checkConfiguration=function() {
	var _this=this;
	return new Promise(function(prom_res, prom_rej) {
		if (!_this.config.code_telecommande) {
			console.log("[assistant-freebox-crystal] Erreur: le code télécommande n'a pas été fourni dans le fichier configuration.json");
			return prom_rej();
		}
		prom_res();
	})
}

/**
 * Fonction appelée par le système central
 *
 * @param {String} commande La commande à executer
 */
AssistantFreeboxCrystal.prototype.action = function(commande) {
	var _this=this;
	return _this.executeCommand(commande)
		.then(function() {
			console.log("[assistant-freebox-crystal] Commande « "+commande+" » exécutée");
		})
}

/**
 * Va exécuter les commandes demandées
 */
AssistantFreeboxCrystal.prototype.executeCommand=function(commande) {
	var _this=this;
	var keys=[], baseURL = this.playerURL+"&key=";

	// permet de retourner la clé à envoyer à la Freebox pour les commandes un peu complexe
	var returnKey = function(cmd, usePromise) {
		switch(cmd.split(" ")[0]) {
			case 'zappe': {
				var nom = cmd.replace(/^zappe /,"").replace(/^sur /,"").toLowerCase().replace(/\s(\d)/g,"$1");
				var canal;
				// si on a "la#" ça signifie qu'on a appelé un nombre
				if (/la\d+/.test(nom)) {
					key = nom.match(/la(\d+)/)[1].split("").join(",");
				} else {
					canal = _this.chaines[nom];
					if (canal) {
						console.log("[assistant-freebox-crystal] Zappe sur "+nom+" ("+canal+")");
						key=canal.split("").join(",")
					} else {
						console.log("[assistant-freebox-crystal] Chaine "+nom+" inconnue");
						return Promise.resolve("");
					}
				}
				break;
			}
			case 'on': {
				// on vérifie si la Freebox est allumée
				key = 'power,wait7000'
				break;
			}
			case 'off': {
				// on vérifie si la Freebox est allumée
				key = "power"
				break;
			}
			case 'tv': {
				key = 'home,wait3000,home,ok,wait4000';
				if (_this.config.use_Mon_Bouquet==true) {
					key='home,wait3000,home,up,up,up,ok,wait4000';
				}
				if (_this.config.use_Chaines_CANAL==true) {
					key='home,wait3000,home,down,down,ok,wait7000';
				}
				break;
			}
			/*case 'tvOn': { key='power,wait7000,'+(_this.config.use_Mon_Bouquet==false?'home,home,ok':'home,home,up,up,up,ok'); break; }*/
			case 'unmute': { key='mute'; break; }
			case 'home': { key='home,wait3000,red'; break; }
			case 'back': { key='red'; break; }
			case 'pause': { key='play'; break; }
			case 'videos': { key='home,wait3000,home,right,ok'; break; }
			case 'direct': { key='green,ok'; break; }
			case 'enregistrements': { key='home,wait3000,home,up,ok'; break; }
			case 'soundDown': { key='vol_dec'; break; }
			case 'soundUp': { key='vol_inc'; break; }
			case 'programUp': { key='prgm_inc'; break; }
			case 'programDown': { key='prgm_dec'; break; }
			default: { key=cmd; break; }
		}

		return (usePromise===false?key:Promise.resolve(key));
	}

	// on peut avoir plusieurs commandes (séparées par une virgule) à envoyer à la Freebox
	return PromiseChain(commande.split(','), function(key) {
		return returnKey(key)
			.then(function(key) {
				if (key) {
					// on regarde si on a une étoile (*) signifiant qu'on répète plusieurs fois la même commande
					if (key.indexOf("*") !== -1) {
						key=key.replace(/(\w+)\*(\d+)/g, function(match, p1, p2) {
							var ret=Array(p2*1+1);
							p1=returnKey(p1, false);
							return ret.join(p1+",").slice(0,-1)
						});
					}
					key.split(',').forEach(function(k) {
						keys.push(k);
					})
				}
			})
	})
		/*.then(function() {
			if (keys.length===0) throw "[assistant-freebox-crystal] Aucune action nécessaire.";
			// si la première key n'est pas 'power', alors on va vérifier que la Freebox est allumée pour effectuer l'action
			// si elle n'est pas allumée, on l'allume
			return (keys[0] !== "power" ? _this.isPlayerOn() : Promise.resolve(true))
		})*/
		.then(function(state) {
			/*if (!state) {
				keys.splice(0,0,'power','wait7000'); // on l'allume
				console.log("[assistant-freebox-crystal] La Freebox n'est pas allumée, donc on l'allume.");
			}*/
			return PromiseChain(keys, function(key, idx) {
				// on regarde si c'est un "waitXXX"
				if (key.slice(0,4) === "wait") {
					return new Promise(function(p_res) {
						setTimeout(function() {
							p_res()
						}, key.slice(4)*1)
					})
				} else {
					var url = baseURL + key;
					return new Promise(function(p_res, p_rej) {
						var delay = _this.config.delay_default||500; // defaut
						if (key.slice(0,3)==="vol") {
							delay=_this.config.delay_volume||20; // pour le volume on veut réduire le délai entre chaque commande
						}
						if (Number.isInteger(key*1)) {
							delay=_this.config.delay_canal||300; // pour le changement de chaine
							// pour canal sat il est nécessaire de faire un appui long pour changer de chaine
							if (_this.config.use_Chaines_CANAL && idx+1 < keys.length) {
								url += "&long=true";
							}
						}
						console.log("[assistant-freebox-crystal] Url => "+url);
						setTimeout(function() {
							request({
								url:url,
								agentOptions:{ "rejectUnauthorized":false }
							})
								.then(function() { p_res() })
								.catch(function(err) {
									if (err.message.indexOf("connect ETIMEDOUT") > -1) {
										p_rej("[assistant-freebox-crystal] Erreur : le Freebox Player ne répond pas ! Essayer de changer le paramètre 'box_to_control' dans la configuration de '"+_this.config.box_to_control+"' à 'hd"+(_this.config.box_to_control.charAt(2) == 1 ? '2':'1')+"', ou de vérifier votre réseau entre cet ordinateur et la Freebox Player.");
									} else if (err.response && err.response.body && err.response.body.indexOf("You don't have permission to access this file on this server.") > -1) {
										p_rej("[assistant-freebox-crystal] Erreur : le code télécommande fourni ("+_this.config.code_telecommande+") est incorrect !");
									} else {
										p_rej("[assistant-freebox-crystal] Erreur lors de l'envoie de la commande vers la Freebox => ",err.response.body)
									}
								})
						}, delay)
					})
				}
			})
				.catch(function(err) {
					console.log(err)
				})
		})
		.catch(function(err) {
			console.log(err)
		})
}

AssistantFreeboxCrystal.prototype.toBase64=function(str) { return Buffer.from(str).toString('base64') }
AssistantFreeboxCrystal.prototype.fromBase64=function(str) { return Buffer.from(str, 'base64').toString() }

/**
 * Initialisation du plugin
 *
 * @param  {Object} configuration La configuration
 * @param  {Object} plugins Un objet qui contient tous les plugins chargés
 * @return {Promise} resolve(this)
 */
exports.init=function(configuration, plugins) {
	return new AssistantFreeboxCrystal(configuration).init(plugins)
		.then(function(resource) {
			console.log("[assistant-freebox-crystal] Plugin chargé et prêt.");
			return resource;
		})
}