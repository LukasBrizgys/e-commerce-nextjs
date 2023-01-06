import { Category } from "@prisma/client";
import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { PostgrestResponse } from "@supabase/supabase-js";
import { GetServerSideProps, GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import Head from "next/head";
import Link from "next/link";
import { getUserOrders } from "../../src/db/queries/order.queries";
import { OrderWithStatus } from "../../src/types/Order.type";
export const getServerSideProps : GetServerSideProps = async(ctx : GetServerSidePropsContext) => {
    const supabase = createServerSupabaseClient(ctx);
    const userResponse = await supabase.auth.getUser();
    if(!userResponse.data.user) return {props:{}, redirect: { basePath:'/', permanent:false} };
    const orders = await getUserOrders(userResponse.data.user.id);
    const { data: categories, error: categoryError } : PostgrestResponse<Category> = await supabase.from('Category').select('*');

    return {
        props:{
            categories,
            orders :JSON.parse(JSON.stringify(
                orders,
                (key, value) => (typeof value === 'bigint' ? value.toString() : value) // return everything else unchanged
              ))
        }
    }
}
const userOrders = (props: InferGetServerSidePropsType<typeof getServerSideProps>) => {
    return (
        <>
            <Head>
                <title>Mano užsakymai</title>
                <meta property="og:title" content="Katalogas" key="title"/>
            </Head>
            <h1 className="text-center text-2xl my-5">Mano užsakymai</h1>
            <table className="table-fixed text-center w-3/4 mx-auto">
                <thead className="text-xl">
                    <tr>
                        <th>
                            Užsakymo ID
                        </th>
                        <th>
                            Sukurtas
                        </th>
                        
                        <th>
                            Vardas
                        </th>
                        <th>
                            Suma
                        </th>
                        <th>
                            Statusas
                        </th>
                        <th>
                            Veiksmai
                        </th>
                    </tr>
                </thead>
                <tbody className="text-xl">
                    {
                    props.orders && props.orders.map((order : OrderWithStatus) => (
                        <tr className="border-y p-3" key={Number(order.id)}>
                            <td>
                                {order.id.toString(10)}
                            </td>
                            <td>
                                {order.createdAt.toString()}
                            </td>
                             <td>
                                {order.billingName}
                            </td>
                            
                            

                            <td>
                                {(Number(order.totalPrice) / 100).toString()}&euro;
                            </td>
                           <td>
                                {order.Status.name}
                            </td>
                            <td>
                                <Link className="underline text-blue-600"  href={`/uzsakymai/${order.id.toString()}`}>Peržiūrėti</Link>
                            </td>
                        </tr>
                    ))
                }
                </tbody>
                
            </table>
        </>
    )
}
export default userOrders;