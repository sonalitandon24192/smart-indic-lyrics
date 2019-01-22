angular.module('todoApp')
    .factory('logService', ['$log', function($log) {
        return {
            success: function(request, response) {
                $log.info('SUCCESS! Request:', request, 
                            ', Response data:', response.data, 
                            ', status:', response.status, 
                            ', statusText:', response.statusText);
            },
            
            failed: function(request, response) {
                $log.error('FAILED! Request:', request, 
                            ', Response data:', response.data, 
                            ', status:', response.status, 
                            ', statusText:', response.statusText);
            }
        }
    }]);
