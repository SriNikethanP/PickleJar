 import {
   Card,
   CardHeader,
   CardTitle,
   CardContent,
 } from "@/components/ui/card";
 import dynamic from "next/dynamic";
 import { getAdminDashboardData } from "@/lib/data/admin";

 const ECharts = dynamic(() => import("echarts-for-react"), { ssr: false });

 export default async function AdminAnalyticsPage() {
   const data = await getAdminDashboardData();

   // Example data for stacked area chart (replace with real trend data)
   const areaSeries = [
     {
       name: "Revenue",
       type: "line",
       stack: "Total",
       areaStyle: {
         color: {
           type: "linear",
           x: 0,
           y: 0,
           x2: 0,
           y2: 1,
           colorStops: [
             { offset: 0, color: "#60a5fa" },
             { offset: 1, color: "#dbeafe" },
           ],
         },
       },
       emphasis: { focus: "series" },
       data: data.revenueTrend,
       smooth: true,
     },
     {
       name: "Orders",
       type: "line",
       stack: "Total",
       areaStyle: {
         color: {
           type: "linear",
           x: 0,
           y: 0,
           x2: 0,
           y2: 1,
           colorStops: [
             { offset: 0, color: "#34d399" },
             { offset: 1, color: "#d1fae5" },
           ],
         },
       },
       emphasis: { focus: "series" },
       data: data.revenueTrend.map((v: number) => Math.round(v / 10)), // Fake orders trend
       smooth: true,
     },
   ];

   // Example data for Nightingale (rose) chart (use categoryPieData)
   const roseData = data.categoryPieData.map((d: any) => ({
     value: d.value,
     name: d.name,
   }));

   return (
     <div className="p-8 space-y-8">
       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
         <Card>
           <CardHeader>
             <CardTitle>
               Gradient Stacked Area Chart (Revenue & Orders)
             </CardTitle>
           </CardHeader>
           <CardContent>
             <ECharts
               option={{
                 tooltip: { trigger: "axis" },
                 legend: { data: ["Revenue", "Orders"] },
                 xAxis: {
                   type: "category",
                   boundaryGap: false,
                   data: data.trendLabels,
                 },
                 yAxis: { type: "value" },
                 series: areaSeries,
               }}
               style={{ height: 350 }}
             />
           </CardContent>
         </Card>
         <Card>
           <CardHeader>
             <CardTitle>Nightingale Chart (Category Distribution)</CardTitle>
           </CardHeader>
           <CardContent>
             <ECharts
               option={{
                 tooltip: { trigger: "item" },
                 legend: { top: "5%", left: "center" },
                 series: [
                   {
                     name: "Categories",
                     type: "pie",
                     radius: ["20%", "80%"],
                     center: ["50%", "50%"],
                     roseType: "area",
                     itemStyle: { borderRadius: 8 },
                     data: roseData,
                   },
                 ],
               }}
               style={{ height: 350 }}
             />
           </CardContent>
         </Card>
       </div>
     </div>
   );
 }
