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
    var return_array_date = [];
    var return_array_date_s = [];
    var return_array_date_z = [];    

    var check_array_zone = [];
    var check_array_state = [];
    var check_array_city = [];
    var check_array_date = [];
    var check_array_date_s = [];
    var check_array_date_z = [];

    var return_array_line = [];
    var check_array_line = [];
    var return_array_line_s = [];
    var check_array_line_s = [];
    var return_array_line_z = [];
    var check_array_line_z = [];

	record.find().select(['state','city','bill_date','net_amount_sum']).exec(function(err, records) {

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
                        
            var zone = zones[row.state.toLowerCase()];
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

            var d = new Date(row.bill_date);
            var c = d.getMonth() + '_' + d.getFullYear();            
            var index_date = check_array_date.indexOf(c);
            if(check_array_date.indexOf(c) < 0){
                check_array_date.push(c);
                tmp = d.toISOString().replace(/T/, ' ').replace(/\..+/, '')
                return_array_date.push({date:tmp,sale:1, net_amount_sum:row.net_amount_sum});
            }else{
                //@ update the sale count
                return_array_date[index_date].sale = return_array_date[index_date].sale + 1;
                return_array_date[index_date].net_amount_sum = return_array_date[index_date].net_amount_sum + row.net_amount_sum;
            }
                        
            var c_s = d.getMonth() + '_' + d.getFullYear() + '_' + row.state.toLowerCase();
            var index_date_s = check_array_date_s.indexOf(c_s);
            if(check_array_date_s.indexOf(c_s) < 0){
                check_array_date_s.push(c_s);
                tmp = d.toISOString().replace(/T/, ' ').replace(/\..+/, '')
                return_array_date_s.push({state:row.state,date:tmp,sale:1, net_amount_sum:row.net_amount_sum});
            }else{
                //@ update the sale count
                return_array_date_s[index_date_s].sale = return_array_date_s[index_date_s].sale + 1;
                return_array_date_s[index_date_s].net_amount_sum = return_array_date_s[index_date_s].net_amount_sum + row.net_amount_sum;
            }

            var c_z = d.getMonth() + '_' + d.getFullYear() + '_' + zone;
            var index_date_z = check_array_date_z.indexOf(c_z);
            if(check_array_date_z.indexOf(c_z) < 0){
                check_array_date_z.push(c_z);
                tmp = d.toISOString().replace(/T/, ' ').replace(/\..+/, '')
                return_array_date_z.push({zone:zone,date:tmp,sale:1, net_amount_sum:row.net_amount_sum});
            }else{
                //@ update the sale count
                return_array_date_z[index_date_z].sale = return_array_date_z[index_date_z].sale + 1;
                return_array_date_z[index_date_z].net_amount_sum = return_array_date_z[index_date_z].net_amount_sum + row.net_amount_sum;
            }
            
            if(d.getFullYear() == 2016) {
	            var day = (d.getDate() - 1);
	            var c_l = String(day)+'_'+ d.getMonth()+'_'+ d.getFullYear();
	            var index_line = check_array_line.indexOf(c_l);
	            if(check_array_line.indexOf(c_l) < 0){
	                check_array_line.push(c_l);
	                tmp = d.toISOString().replace(/T/, ' ').replace(/\..+/, '')
	                return_array_line.push({date:tmp,sale:1, net_amount_sum:row.net_amount_sum});
	            }else{
	                //@ update the sale count
	                return_array_line[index_line].sale = return_array_line[index_line].sale + 1;
	                return_array_line[index_line].net_amount_sum = return_array_line[index_line].net_amount_sum + row.net_amount_sum;
	            }

	            var day = (d.getDate() - 1);
	            var c_lz = String(day)+'_'+ d.getMonth()+'_'+ d.getFullYear() + '_' + zone;
	            var index_line_z = check_array_line_z.indexOf(c_lz);
	            if(check_array_line_z.indexOf(c_lz) < 0){
	                check_array_line_z.push(c_lz);
	                tmp = d.toISOString().replace(/T/, ' ').replace(/\..+/, '')
	                return_array_line_z.push({zone:zone,date:tmp,sale:1, net_amount_sum:row.net_amount_sum});
	            }else{
	                //@ update the sale count
	                return_array_line_z[index_line_z].sale = return_array_line_z[index_line_z].sale + 1;
	                return_array_line_z[index_line_z].net_amount_sum = return_array_line_z[index_line_z].net_amount_sum + row.net_amount_sum;
	            }

	            var day = (d.getDate() - 1);
	            var c_ls = String(day)+'_'+ d.getMonth()+'_'+ d.getFullYear() + '_' + row.state.toLowerCase();
	            var index_line_s = check_array_line_s.indexOf(c_ls);
	            if(check_array_line_s.indexOf(c_ls) < 0){
	                check_array_line_s.push(c_ls);
	                tmp = d.toISOString().replace(/T/, ' ').replace(/\..+/, '')
	                return_array_line_s.push({state:row.state,date:tmp,sale:1, net_amount_sum:row.net_amount_sum});
	            }else{
	                //@ update the sale count
	                return_array_line_s[index_line_s].sale = return_array_line_s[index_line_s].sale + 1;
	                return_array_line_s[index_line_s].net_amount_sum = return_array_line_s[index_line_s].net_amount_sum + row.net_amount_sum;
	            }
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

        return_array_date.sort(function(a, b){
            var nameA=a.date.toLowerCase(), nameB=b.date.toLowerCase()
            if (nameA < nameB) //sort string ascending
                return -1 
            if (nameA > nameB)
                return 1
            return 0 //default return value (no sorting)
        });

        return_array_date_z.sort(function(a, b){
            var nameA=a.date.toLowerCase(), nameB=b.date.toLowerCase()
            if (nameA < nameB) //sort string ascending
                return -1 
            if (nameA > nameB)
                return 1
            return 0 //default return value (no sorting)
        });

        return_array_date_s.sort(function(a, b){
            var nameA=a.date.toLowerCase(), nameB=b.date.toLowerCase()
            if (nameA < nameB) //sort string ascending
                return -1 
            if (nameA > nameB)
                return 1
            return 0 //default return value (no sorting)
        });

        return_array_line.sort(function(a, b){
            var nameA=a.date.toLowerCase(), nameB=b.date.toLowerCase()
            if (nameA < nameB) //sort string ascending
                return -1 
            if (nameA > nameB)
                return 1
            return 0 //default return value (no sorting)
        });

        return_array_line_s.sort(function(a, b){
            var nameA=a.date.toLowerCase(), nameB=b.date.toLowerCase()
            if (nameA < nameB) //sort string ascending
                return -1 
            if (nameA > nameB)
                return 1
            return 0 //default return value (no sorting)
        });

        return_array_line_z.sort(function(a, b){
            var nameA=a.date.toLowerCase(), nameB=b.date.toLowerCase()
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
			sales_date:return_array_date,
			sales_date_s:return_array_date_s,
			sales_date_z:return_array_date_z,
			sales_line:return_array_line,
			sales_line_z:return_array_line_z,
			sales_line_s:return_array_line_s,
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