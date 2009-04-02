/*-----------------------------------------------------------------*/
	
	$(document).ready(function() {
		$('.field-date').each(function() {
			var field = $(this);
			var date_table = $('<table />');
			var date_table_head = $('<thead><tr /></thead>');
			var date_table_body = $('<tbody>');
			var date_select = $('<select />');
			var date_input = field.find('input');
			var container = field.after('<div />').next();
			var current = null;
			
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
				date_table_body.find('td').each(function() {
					var date_table_item = $(this);
					
					date_table_item.find('span').text(working.toString('d '));
					date_table_item
						.removeClass('last-month')
						.removeClass('next-month')
						.removeClass('this-month')
						.removeClass('inactive')
						.removeClass('today');
					
					// Choose class:
					if (
						parseInt(working.toString('M'))
						< parseInt(current.toString('M'))
					) {
						date_table_item
							.addClass('last-month')
							.addClass('inactive');
						
					} else if (
						parseInt(working.toString('M'))
						> parseInt(current.toString('M'))
					) {
						date_table_item
							.addClass('next-month')
							.addClass('inactive');
						
					} else {
						date_table_item.addClass('this-month');
						
						if (working.toString('d') == current.toString('d')) {
							date_table_item.addClass('today');
						}
					}
					
					date_table_item.unbind('click');
					date_table_item.click(function() {
						var self = $(this);
						
						if (self.hasClass('last-month')) {
							current.last().month();
							
						} else if (self.hasClass('next-month')) {
							current.next().month();
						}
						
						current.set({ day: parseInt(self.text()) });
						
						update();
					});
					
					working.next().day();
				});
				
				// Populate select:
				working = current.clone().add(-6).months();
				date_select.empty(); ticker = 0;
				
				while (ticker++ < 13) {
					var date_select_option = $('<option />');
					
					date_select_option.text(working.toString('MMMM yyyy'));
					date_select_option.val(working.toString('M yyyy'));
					
					if (ticker == 7) {
						date_select_option.attr('selected', 'selected');
					}
					
					date_select.append(date_select_option);
					working.next().month();
				}
				
				// Change date select:
				date_select.unbind('change');
				date_select.change(function() {
					var bits = $(this).val().split(' ');
					
					current.set({
						month: parseInt(bits[0]) - 1,
						year: parseInt(bits[1])
					});
					
					update();
				});
				
				// Change date manually:
				date_input.unbind('change');
				date_input.change(function() {
					var next = Date.parse($(this).val());
					
					if (next != null) {
						current = next.clone();
						update();
					}
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
					var date_table_item = $('<td>' + working.toString('ddd') + '</td>');
					
					date_table_head.find('tr').append(date_table_item);
					
					working.next().day();
				}
				
				// Inseert body rows:
				ticker = 0;
				
				while (ticker++ < 6) {
					var date_table_row = $('<tr />');
					var days = 0;
					
					while (days++ < 7) {
						var date_table_item = $('<td><span>#</span></td>');
						
						if (days % 2) {
							date_table_item.addClass('odd');
							
						} else {
							date_table_item.addClass('even');
						}
						
						date_table_row.append(date_table_item);
						date_table_body.append(date_table_row);
					}
				}
			}
			
		/*---------------------------------------------------------*/
			
			container.addClass('calendar-overlay');
			
			// Set current date:
			current = Date.parse(date_input.val());
			
			// Container for calendar:
			container.append('<div class="date-table" />');
			container.find('.date-table').append(
				date_table.append(date_table_head).append(date_table_body)
			);
			
			// Container for selector:
			container.append('<label class="date-select">Month</label>');
			container.find('.date-select').append(date_select);
			
			// Move input box:
			container.append('<label class="date-input">Current Date</label>');
			container.find('.date-input').append(date_input);
			
			// Away we go:
			prepare(); update();
		});
	});
	
/*-----------------------------------------------------------------*/