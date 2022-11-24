import { deleteCookie } from "cookies-next";
import { GetServerSidePropsContext } from "next";
import Head from "next/head";
import Link from "next/link";
export async function getServerSideProps(context : GetServerSidePropsContext) {
    deleteCookie('paymentIntentId', {req:context.req, res:context.res});
    return {
        props:{}
    }
  }
const Success = () => {
    return (
        <>
            <Head>
                <title>Sėkmingas užsakymas</title>
                <meta property="og:title" content="Sėkmingas užsakymas" key="title" />
                <meta charSet='UTF-8'/>
                <meta name="description" content="Sėkmingas užsakymas" />
            </Head>
            <div className="flex flex-col gap-10 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                <h1 className="font-medium text-6xl text-teal-700 text-center">Užsakymas įvykdytas sėkmingai!</h1>
                <Link className="text-center text-4xl text-teal-900 underline" href='/'>Grįžti į pagrindinį puslapį</Link>
            </div>
        </>
    )
}
export default Success;