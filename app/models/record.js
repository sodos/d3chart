
//app/models/record.js
//load the things we need
var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');

//@ define the schema for our record model
var recordSchema = mongoose.Schema({			
	"customer_id" : Number,
	"age" : Number,
	"age_group" : String,
	"gender" : String,
	"loyality_grade" : String,
	"loyality_tenure" : Number,
	"source_short_name" : String,
	"city" : String,
	"state" : String,
	"bill_date" : String,
	"bill_no" : String,
	"barcode" : Number,
	"bill_time" : String,
	"bill_qty_sum" : Number,
	"bill_mrp_sum" : Number,
	"mrp_amount_sum" : Number,
	"basic_amount_sum" : Number,
	"sale_amount_sum" : Number,
	"tax_amount_sum" : Number,
	"total_discount_amount_sum" : Number,
	"net_amount_sum" : Number,
	"billlevel_remarks" : String,
	"dept" : String,
	"product" : String,
	"style" : String,
	"shade" : String,
	"size_1" : String,
	"season" : String,
	"mrp" : Number
});

//@
module.exports = mongoose.model('ex_records', recordSchema);