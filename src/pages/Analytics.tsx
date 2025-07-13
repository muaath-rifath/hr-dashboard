import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import DepartmentRatingsChart from '../components/charts/DepartmentRatingsChart';
import BookmarkTrendsChart from '../components/charts/BookmarkTrendsChart';


const Analytics: React.FC = () => {
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Department-wise Average Ratings</CardTitle>
          </CardHeader>
          <CardContent>
            <DepartmentRatingsChart />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Bookmark Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <BookmarkTrendsChart />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Analytics;
