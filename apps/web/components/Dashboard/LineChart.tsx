"use client";

import { useTheme } from "next-themes";
import { CartesianGrid, LabelList, Line, LineChart, XAxis } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import Footer from "@/components/Footer";
import { tokenCountData } from "./tokenCountData";
import { BodhiToken_ABI } from "@/utils/abi";
import { BodhiToken_Proxy_Address } from "@/utils/contractAddress";
import { useEffect, useState } from "react";
import { useAccount,useReadContract  } from "wagmi";
import DashboardHeader from "../Header/DashHeader";

export const description = "A line chart with a label";

const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "hsl(var(--chart-1))",
  },
  mobile: {
    label: "Mobile",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;

export function LineChartWithLabel() {
  const { theme } = useTheme();
  const { address} = useAccount();
  const transformedData = tokenCountData.map((data) => {
    const date = new Date(data.timestamp);
    const formattedDate = `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;

    return {
      timestamp: formattedDate,
      totalToken: data.inputToken + data.outputToken,
    };
  });
  const [currentAddress, setCurrentAddress] = useState("");

  useEffect(() => {
    if (address) {
      setCurrentAddress(address);
    }
  }, [address]);

  const { data: balanceBodhi, refetch: refetchBodhi } = useReadContract({
    abi: BodhiToken_ABI,
    address: BodhiToken_Proxy_Address,
    functionName: "balanceOf",
    args: [address],
  });

  useEffect(()=>{
    if(address){
    refetchBodhi()
    }
  },[address,refetchBodhi])

  return (
    <div className="w-full flex flex-col gap-12"> <DashboardHeader amount={balanceBodhi}/>
         <main className="flex flex-col justify-center items-center">
    <div className="w-3/4">
      <Card>
        <CardHeader>
          <CardTitle>Line Chart - Label</CardTitle>
          <CardDescription>Token Count Chart</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig}>
            <LineChart
              accessibilityLayer
              data={transformedData}
              className="fill-black dark:fill-white"
              margin={{
                top: 20,
                left: 12,
                right: 12,
              }}
            >
              <CartesianGrid vertical={false} />
              <XAxis
                className="fill-green-800 text-bold dark:fill-white"
                dataKey="timestamp"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
              />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent indicator="line" />}
              />
              <Line
                dataKey="totalToken"
                type="natural"
                stroke={theme === "dark" ? "#ffffff" : "#000000"} // Change line color based on theme
                strokeWidth={2}
                dot={{
                  fill: "var(--color-desktop)",
                }}
                activeDot={{
                  r: 6,
                }}
              >
                <LabelList
                  position="top"
                  offset={12}
                  className="fill-black dark:fill-white "
                  fontSize={12}
                />
              </Line>
            </LineChart>
          </ChartContainer>
        </CardContent>
        <CardFooter className="flex-col items-start gap-2 text-sm">
          <div className="flex gap-2 font-medium leading-none text-xs md:text-lg">
          {currentAddress ? currentAddress : "Loading..."}
          </div>
          <div className="leading-none text-muted-foreground">
            Showing Token Count for all the tokens that have been spent on
            prompting by the user
          </div>
        </CardFooter>
      </Card>
    </div>
    </main>
    <Footer />
    </div>
  );
}