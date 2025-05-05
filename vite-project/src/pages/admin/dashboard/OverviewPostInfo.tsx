import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function OverviewPostInfo() {
    return (
        <div className="flex items-center content-center gap-15">
            {
                overviewData.map((data) => {
                    return (
                        <Card className="w-2xs">
                            <CardHeader>
                                <CardTitle className="text-center">{data.type}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <CardTitle className="text-center">{data.quantity}</CardTitle>
                            </CardContent>
                        </Card>
                    )
                })
            }
        </div>
    )
}

const overviewData = [
    {
        "type": "public",
        "quantity": 100,
    },
    {
        "type": "pending",
        "quantity": 50,
    },
    {
        "type": "hold/reject",
        "quantity": 150,
    }

]