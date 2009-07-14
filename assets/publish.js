/*-----------------------------------------------------------------*/
	
	jQuery(document).ready(function() {
		jQuery('.field-date').each(function() {
			var field = jQuery(this);
			var date_cal = jQuery('<table />');
			var date_cal_head = jQuery('<thead><tr /></thead>');
			var date_cal_body = jQuery('<tbody>');
			
			var date_month = jQuery('<select />');
			
			var date_input = field.find('input');
			
			var container = field.after('<div />').next();
			var current = null; var editing = false;
			
			var update = function() {
				var working = current.clone();
				var ticker = 0;
				
				// Update date input:
				date_input.val(
					current.toString('dd MMMM yyyy hh:mm ')
					+ current.toString('tt').toLowerCase()
				);
				
				// Start on the first:
				working.set({ day: 1 });
				
				// Start week on sunday:
				if (!working.is().sunday()) working.last().sunday();
				
				// Update days:
				date_cal_body.find('td').each(function() {
					var date_cal_item = jQuery(this);
					
					date_cal_item.find('a').text(working.toString('d '));
					date_cal_item
						.removeClass('last-month')
						.removeClass('next-month')
						.removeClass('this-month')
						.removeClass('today');
					
					// Choose class:
					if (
						parseInt(working.toString('yyyy'))
						< parseInt(current.toString('yyyy'))
					) {
						date_cal_item
							.addClass('last-month');
						
					} else if (
						parseInt(working.toString('yyyy'))
						> parseInt(current.toString('yyyy'))
					) {
						date_cal_item
							.addClass('next-month');
						
					} else if (
						parseInt(working.toString('M'))
						< parseInt(current.toString('M'))
					) {
						date_cal_item
							.addClass('last-month');
						
					} else if (
						parseInt(working.toString('M'))
						> parseInt(current.toString('M'))
					) {
						date_cal_item
							.addClass('next-month');
						
					} else {
						date_cal_item.addClass('this-month');
						
						if (working.toString('d') == current.toString('d')) {
							date_cal_item.addClass('today');
						}
					}
					
					date_cal_item.unbind('click');
					date_cal_item.click(function() {
						var self = jQuery(this);
						
						if (self.hasClass('last-month')) {
							current.last().month();
							
						} else if (self.hasClass('next-month')) {
							current.next().month();
						}
						
						current.set({ day: parseInt(self.text()) });
						
						update(); return false;
					});
					
					working.next().day();
				});
				
				// Populate select:
				working = current.clone().add(-6).months();
				date_month.empty(); ticker = 0;
				
				while (ticker++ < 13) {
					var date_month_option = jQuery('<option />');
					
					date_month_option.text(working.toString('MMMM yyyy'));
					date_month_option.val(working.toString('M yyyy'));
					
					if (ticker == 7) {
						date_month_option.attr('selected', 'selected');
					}
					
					date_month.append(date_month_option);
					working.next().month();
				}
				
				// Change date select:
				date_month.unbind('change');
				date_month.change(function() {
					var bits = jQuery(this).val().split(' ');
					
					current.set({
						month: parseInt(bits[0]) - 1,
						year: parseInt(bits[1])
					});
					
					update();
				});
				
				// Change date manually:
				date_input.unbind('change');
				date_input.change(function() {
					var self = jQuery(this);
					var next = Date.parse(self.val());
					
					editing = false;
					
					if (next != null) {
						self.removeClass('error');
						current = next.clone();
						update();
						
					} else {
						self.addClass('error');
					}
				});
				
				date_input.removeClass('error');
				date_input.unbind('keyup');
				date_input.keyup(function(event) {
					var self = jQuery(this);
					
					editing = true;
					
					setTimeout(function() {
						var next = Date.parse(self.val());
						
						if (editing) {
							self.removeClass('error');
							
							if (next == null) self.addClass('error');
						}
						
						editing = false;
						
					}, 250);
				});
			};
			
		/*---------------------------------------------------------*/
			
			var prepare = function() {
				var working = current.clone();
				var ticker = 0;
				
				// Start on the first:
				working.set({ day: 1 });
				
				// Start week on sunday:
				if (!working.is().sunday()) working.last().sunday();
				
				// Insert header days:
				while (ticker++ < 7) {
					var date_cal_item = jQuery('<td>' + working.toString('ddd') + '</td>');
					
					date_cal_head.find('tr').append(date_cal_item);
					
					working.next().day();
				}
				
				// Inseert body rows:
				ticker = 0;
				
				while (ticker++ < 6) {
					var date_cal_row = jQuery('<tr />');
					var days = 0;
					
					while (days++ < 7) {
						var date_cal_item = jQuery('<td><a href="#">#</a></td>');
						
						if (days % 2) {
							date_cal_item.addClass('odd');
							
						} else {
							date_cal_item.addClass('even');
						}
						
						date_cal_row.append(date_cal_item);
						date_cal_body.append(date_cal_row);
					}
				}
				
				// Calendar complete:
				date_cal
					.append(date_cal_head)
					.append(date_cal_body);
			}
			
		/*---------------------------------------------------------*/
			
			container.addClass('calendar-overlay');
			
			// Set current date:
			current = Date.parse(date_input.val());
			
			if (current == null) {
				current = Date.parse("now");
			}
			
			// Container for calendar:
			container.append('<div class="date-cal" />');
			container.find('.date-cal').append(date_cal);
			
			// Container for selector:
			container.append('<label class="date-month">Month</label>');
			container.find('.date-month').append(date_month);
			
			// Move input box:
			container.append('<label class="date-input">Current Date</label>');
			container.find('.date-input').append(date_input);
			
			// Away we go:
			prepare(); update();
		});
	});
	
/*-----------------------------------------------------------------*/