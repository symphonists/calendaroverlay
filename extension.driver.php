<?php
	
	class Extension_CalendarOverlay extends Extension {
	/*-------------------------------------------------------------------------
		Definition:
	-------------------------------------------------------------------------*/
		
		public function about() {
			return array(
				'name'			=> 'Calendar Overlay',
				'version'		=> '1.0.3',
				'release-date'	=> '2009-04-02',
				'author'		=> array(
					'name'			=> 'Rowan Lewis',
					'website'		=> 'http://pixelcarnage.com/',
					'email'			=> 'rowan@pixelcarnage.com'
				),
				'description'	=> 'Converts date fields into calendars.'
			);
		}
		
		public function getSubscribedDelegates() {
			return array(
				array(
					'page'		=> '/backend/',
					'delegate'	=> 'InitaliseAdminPageHead',
					'callback'	=> 'initaliseAdminPageHead'
				)
			);
		}
		
		public function initaliseAdminPageHead($context) {
			$page = $context['parent']->Page;
			
            $page->addScriptToHead(URL . '/extensions/calendaroverlay/assets/datejs.core.js', 3466703);
            $page->addScriptToHead(URL . '/extensions/calendaroverlay/assets/publish.js', 3466704);
			$page->addStylesheetToHead(URL . '/extensions/calendaroverlay/assets/publish.css', 'screen', 3466701);
		}
	}
		
?>