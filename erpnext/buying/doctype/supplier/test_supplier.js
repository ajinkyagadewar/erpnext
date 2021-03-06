QUnit.module('Buying');

QUnit.test("test: supplier", function(assert) {
	assert.expect(6);
	let done = assert.async();
	frappe.run_serially([
		() => {
			return frappe.tests.make('Supplier', [
				{supplier_name: 'Test Supplier'},
				{supplier_type: 'Hardware'},
				{country: 'United States'},
				{default_currency: 'USD'},
				{default_price_list: 'Test-Buying-USD'},
				{credit_days_based_on: 'Fixed Days'},
				{accounts: [
					[
						{'company': "Test Company"},
						{'account': "Creditors - TC"}
					]]
				}
			]);
		},
		() => frappe.timeout(1),
		() => frappe.click_button('New Address'),
		() => {
			return frappe.tests.set_form_values(cur_frm, [
				{address_title:"Test3"},
				{address_type: "Billing"},
				{address_line1: "Billing Street 3"},
				{city: "Billing City 3"},
			]);
		},
		() => cur_frm.save(),
		() => frappe.timeout(2),
		() => frappe.click_button('New Address'),
		() => {
			return frappe.tests.set_form_values(cur_frm, [
				{address_title:"Test3"},
				{address_type: "Shipping"},
				{address_line1: "Shipping Street 3"},
				{city: "Shipping City 3"},
			]);
		},
		() => cur_frm.save(),
		() => frappe.timeout(2),
		() => frappe.click_button('New Address'),
		() => {
			return frappe.tests.set_form_values(cur_frm, [
				{address_title:"Test3"},
				{address_type: "Warehouse"},
				{address_line1: "Warehouse Street 3"},
				{city: "Warehouse City 3"},
			]);
		},
		() => cur_frm.save(),
		() => frappe.timeout(2),
		() => frappe.click_button('New Contact'),
		() => {
			return frappe.tests.set_form_values(cur_frm, [
				{first_name: "Contact 3"}
			]);
		},
		() => cur_frm.save(),
		() => frappe.timeout(1),
		() => frappe.set_route('Form', 'Supplier', 'Test Supplier'),
		() => frappe.timeout(0.3),

		() => {
			assert.ok(cur_frm.doc.supplier_name == 'Test Supplier', "Name correct");
			assert.ok(cur_frm.doc.supplier_type == 'Hardware', "Type correct");
			assert.ok(cur_frm.doc.default_currency == 'USD', "Currency correct");
			assert.ok(cur_frm.doc.accounts[0].account == 'Creditors - '+frappe.get_abbr('Test Company'), " Account Head abbr correct");
			assert.ok($('.address-box:nth-child(3) p').text().includes('Shipping City 3'), "Address correct");
			assert.ok($('.col-sm-6+ .col-sm-6 .h6').text().includes('Contact 3'), "Contact correct");
		},
		() => done()
	]);
});