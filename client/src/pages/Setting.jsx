import React from 'react';
import { Home, ChevronRight } from 'lucide-react';

const Setting = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <h1 className="text-2xl font-medium text-gray-900">Setting</h1>
            <div className="flex items-center text-sm text-gray-500">
              <Home className="w-4 h-4 mr-1" />
              <ChevronRight className="w-4 h-4 mx-2" />
              <span>Setting</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-4 py-4">
        {/* Organization Setting */}
        <div className="bg-white rounded-lg shadow-sm mb-8">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-medium text-gray-900">Organization Setting</h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
              <div className="flex flex-col">
                <label className="text-sm font-medium text-gray-700 mb-1">Name</label>
                <span className="text-blue-600 font-medium">NHDC</span>
              </div>
              <div className="flex flex-col">
                <label className="text-sm font-medium text-gray-700 mb-1">Code</label>
                <span className="text-gray-600">nhdc</span>
              </div>
              <div className="flex flex-col">
                <label className="text-sm font-medium text-gray-700 mb-1">Type</label>
                <span className="text-gray-600">Govt. Department</span>
              </div>
              <div className="flex flex-col">
                <label className="text-sm font-medium text-gray-700 mb-1">No of employee</label>
                <span className="text-blue-600 font-medium">150</span>
              </div>
              <div className="flex flex-col">
                <label className="text-sm font-medium text-gray-700 mb-1">State</label>
                <span className="text-blue-600 font-medium">Madhya Pradesh</span>
              </div>
              <div className="flex flex-col">
                <label className="text-sm font-medium text-gray-700 mb-1">District</label>
                <span className="text-blue-600 font-medium">Bhopal</span>
              </div>
              <div className="flex flex-col">
                <label className="text-sm font-medium text-gray-700 mb-1">Office Location</label>
                <span className="text-gray-600">
                  Jehanuma Palace Rd, near Hotel Jehanuma Palace,<br />
                  Krishna Nagar, Shymala Hills, Bhopal, Madhya Pradesh<br />
                  462013
                </span>
              </div>
              <div className="flex flex-col">
                <label className="text-sm font-medium text-gray-700 mb-1">Lat-Long</label>
                <span className="text-gray-600">23.2429716, 77.3869804</span>
              </div>
              <div className="flex flex-col">
                <label className="text-sm font-medium text-gray-700 mb-1">Head</label>
                <span className="text-gray-600">A.K Mishra</span>
              </div>
              <div className="flex flex-col">
                <label className="text-sm font-medium text-gray-700 mb-1">Email</label>
                <span className="text-blue-600 font-medium">info@brainware.in</span>
              </div>
              <div className="flex flex-col">
                <label className="text-sm font-medium text-gray-700 mb-1">Contact</label>
                <span className="text-gray-600">9752030023</span>
              </div>
              <div className="flex flex-col">
                <label className="text-sm font-medium text-gray-700 mb-1">Validity From</label>
                <span className="text-gray-600">2020-07-01 00:00:00</span>
              </div>
            </div>
          </div>
        </div>

        {/* App Setting */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-medium text-gray-900">App Setting</h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
              <div className="flex flex-col">
                <label className="text-sm font-medium text-gray-700 mb-1">Operational Contact</label>
                <span className="text-gray-600">7748877488</span>
              </div>
              <div className="flex flex-col">
                <label className="text-sm font-medium text-gray-700 mb-1">Technical Contact</label>
                <span className="text-gray-600">7748877488</span>
              </div>
              <div className="flex flex-col">
                <label className="text-sm font-medium text-gray-700 mb-1">Technical SMS</label>
                <span className="text-gray-600">7748877488</span>
              </div>
              <div className="flex flex-col">
                <label className="text-sm font-medium text-gray-700 mb-1">Technical WhatsApp</label>
                <span className="text-gray-600">7748877488</span>
              </div>
              <div className="flex flex-col">
                <label className="text-sm font-medium text-gray-700 mb-1">Can Synch</label>
                <span className="text-orange-600 font-medium">3 days old data</span>
              </div>
              <div className="flex flex-col">
                <label className="text-sm font-medium text-gray-700 mb-1">Check Out</label>
                <span className="text-gray-600">5 hrs after checkin</span>
              </div>
              <div className="flex flex-col">
                <label className="text-sm font-medium text-gray-700 mb-1">Track User For</label>
                <span className="text-blue-600 font-medium">200 minutes</span>
              </div>
              <div className="flex flex-col">
                <label className="text-sm font-medium text-gray-700 mb-1">Show Google Ad</label>
                <span className="text-gray-600">N</span>
              </div>
              <div className="flex flex-col">
                <label className="text-sm font-medium text-gray-700 mb-1">Show Distance in Diary</label>
                <span className="text-gray-600">N</span>
              </div>
              <div className="flex flex-col">
                <label className="text-sm font-medium text-gray-700 mb-1">In Out Toggle</label>
                <span className="text-gray-600">Y</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Setting;