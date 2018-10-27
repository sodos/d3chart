var numeral 	= require('numeral');
var bcrypt 		= require('bcrypt-nodejs');
var dateFormat 	= require('dateformat');
var constants 	= require('../../config/constants');
var record      = require('../models/record');

exports.loggedIn = function(req, res, next)
{
	if (req.session.user) { // req.session.passport._id
		next();
	} else {
		res.redirect('/login');
	}
}

exports.home = function(req, res) {
	var return_array_zone = [];
	var return_array_state = [];
	var return_array_city = [];
    
    var check_array_zone = [];
    var check_array_state = [];
    var check_array_city = [];
	record.find().select(['state','city']).exec(function(err, records) {

		// console.log(records);
		// var north_zone = ['Jammu and Kashmir','Himachal Pradesh','Punjab','Uttarakhand','Uttar Pradesh','Haryana'];
		// var east_zone = ['Bihar','Orissa','Jharkhand','West Bengal'];
		// var west_zone = ['Rajasthan','Gujrat','Goa','Maharashtra'];
		// var south_zone = ['Andhra Pradesh','Karnataka','Kerala','Tamil Nadu'];
		// var central_zone = ['Madhya Pradesh','Chhattisgarh'];
		// var northeast_zone = ['Assam','Sikkim','Nagaland','Meghalaya','Manipur','Mizoram','Tripura','Arunachal Pradesh'];
		var zones = {'new delhi':'North Zone','jammu and kashmir':'North Zone','himachal pradesh':'North Zone','punjab':'North Zone','uttarakhand':'North Zone','uttar pradesh':'North Zone','haryana':'North Zone','bihar':'East Zone','orissa':'East Zone','jharkhand':'East Zone','west bengal':'East Zone','rajasthan':'West Zone','gujrat':'West Zone','goa':'West Zone','maharashtra':'West Zone','andhra pradesh':'South Zone','karnataka':'South Zone','kerala':'South Zone','tamil nadu':'South Zone','madhya pradesh':'Central Zone','chhattisgarh':'Central Zone','assam':'North East Zone','sikkim':'North East Zone','nagaland':'North East Zone','meghalaya':'North East Zone','manipur':'North East Zone','mizoram':'North East Zone','tripura':'North East Zone','arunachal pradesh':'North East Zone'};
		//@ build the final return_array_state for retuning
        records.forEach(function(row){
            
            var zone = zones[row.state.toLowerCase()]
            var index_zone = check_array_zone.indexOf(zone);           	
            if(check_array_zone.indexOf(zone) < 0){
                check_array_zone.push(zone);
                return_array_zone.push({zone:zone,sale:1});
            }else{
                //@ update the sale count
                return_array_zone[index_zone].sale = return_array_zone[index_zone].sale + 1;
            }

            var index_state = check_array_state.indexOf(row.state);
            if(check_array_state.indexOf(row.state) < 0){
                check_array_state.push(row.state);
                return_array_state.push({zone:zone,state:row.state,sale:1});
            }else{
                //@ update the sale count
                return_array_state[index_state].sale = return_array_state[index_state].sale + 1;
            }                    

            var index_city = check_array_city.indexOf(row.state+'_'+row.city);
            if(check_array_city.indexOf(row.state+'_'+row.city) < 0){
                check_array_city.push(row.state+'_'+row.city);
                return_array_city.push({zone:zone,state:row.state,city:row.city,sale:1});
            }else{
                //@ update the sale count
                return_array_city[index_city].sale = return_array_city[index_city].sale + 1;
            } 

        });
        
        // //@ sorting array to final        
        return_array_zone.sort(function(a, b){
            var nameA=a.zone.toLowerCase(), nameB=b.zone.toLowerCase()
            if (nameA < nameB) //sort string ascending
                return -1 
            if (nameA > nameB)
                return 1
            return 0 //default return value (no sorting)
        });
        return_array_state.sort(function(a, b){
            var nameA=a.zone.toLowerCase(), nameB=b.zone.toLowerCase()
            if (nameA < nameB) //sort string ascending
                return -1 
            if (nameA > nameB)
                return 1
            return 0 //default return value (no sorting)
        });
		return_array_city.sort(function(a, b){
            var nameA=a.zone.toLowerCase(), nameB=b.zone.toLowerCase()
            if (nameA < nameB) //sort string ascending
                return -1 
            if (nameA > nameB)
                return 1
            return 0 //default return value (no sorting)
        });

		res.render('home.ejs', {
			sales_zone:return_array_zone,
			sales_state:return_array_state,
			sales_city:return_array_city,
			constants : constants,
			error : req.flash("error"),
			success: req.flash("success"),
			session:req.session,
		 });
	});
}

exports.signup = function(req, res) {
	if (req.session.user) {
		res.redirect('/home');
	} else {
		res.render('signup', {
			constants : constants,
			error : req.flash("error"),
			success: req.flash("success"),
			session:req.session
		});
	}
}

exports.login = function(req, res) {	
	if (req.session.user) {
		res.redirect('/home');
	} else {
		res.render('login', {
			constants : constants,
			error : req.flash("error"),
			success: req.flash("success"),
			session:req.session
		});
	}
}