// Copyright (c) 2017, Frappe Technologies Pvt. Ltd. and contributors
// For license information, please see license.txt

frappe.ui.form.on('Member', {
	refresh: function(frm) {

		frappe.dynamic_link = {doc: frm.doc, fieldname: 'name', doctype: 'Member'};

		frm.toggle_display(['address_html','contact_html'], !frm.doc.__islocal);

		if(!frm.doc.__islocal) {
			frappe.contacts.render_address_and_contact(frm);

			// custom buttons
			frm.add_custom_button(__('Accounting Ledger'), function() {
				frappe.set_route('query-report', 'General Ledger',
					{party_type:'Member', party:frm.doc.name});
			});

			frm.add_custom_button(__('Accounts Receivable'), function() {
				frappe.set_route('query-report', 'Accounts Receivable', {member:frm.doc.name});
			});

			// indicator
			erpnext.utils.set_party_dashboard_indicators(frm);

		} else {
			frappe.contacts.clear_address_and_contact(frm);
		}

		var email_list = frappe.utils.split_emails(v);
			if (!email_list) {
				// invalid email
				return '';
			} else {
				var invalid_email = false;
				email_list.forEach(function(email) {
					if (!validate_email(email)) {
						frappe.msgprint(__("Invalid Email: {0}", [email]));
						invalid_email = true;
					}
				});

				if (invalid_email) {
					// at least 1 invalid email
					return '';
				} else {
					// all good
					return v;
				}
			}

		frappe.call({
			method:"frappe.client.get_value",
			args:{
				'doctype':"Membership",
				'filters':{'member': frm.doc.name},
				'fieldname':[
					'to_date'
				]
			},
			callback: function (data) {
				frappe.model.set_value(frm.doctype,frm.docname, "membership_expiry_date", data.message.to_date);
			}
		});
	}
});
