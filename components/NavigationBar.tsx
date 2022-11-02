import { Disclosure } from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { Category } from "@prisma/client";
import { useRouter } from "next/router";

function classNames(...classes : string[]) {
    return classes.filter(Boolean).join(' ')
}
const NavigationBar = ({ categories } : any) => {
    const router = useRouter();
    const path = router.asPath.split('/');
    return (

        <Disclosure as="nav" className="shadow-lg">
      {({ open }) => (
        <>
          <div className="flex justify-center px-2 sm:px-6 lg:px-8">
            <div className="relative flex h-16 items-center justify-center">
              <div className="mx-auto absolute inset-y-0 flex items-center md:hidden">
                {/* Mobile menu button*/}
                <Disclosure.Button className="inline-flex items-center justify-center rounded-md p-2 text-gray-700 hover:bg-gray-900 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
                  <span className="sr-only">Open main menu</span>
                  {open ? (
                    <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                  ) : (
                    <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                  )}
                </Disclosure.Button>
              </div>
              <div className="flex items-center justify-center sm:items-stretch sm:justify-center">
                <div className="hidden md:block">
                  <div className="flex xl:gap-10 lg:gap-3 justify-evenly mx-auto items-center">
                    {categories && categories.map((category : Category) => (
                      <a
                        key={category.name}
                        href={`/kategorija/${category.slug}`}
                        className={classNames(
                          category.slug === path[2] ? 'bg-teal-800 text-white' : 'text-gray-900 hover:bg-teal-100 hover:bg-opacity-40',
                          'px-4 py-1 text-center rounded-md xl:text-lg font-medium'
                        )}
                        aria-current={category.slug === path[1] ? 'page' : undefined}
                      >
                        {category.name}
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <Disclosure.Panel className="md:hidden">
            <div className="space-y-1 px-2 pt-2 pb-3">
              {categories && categories.map((category : Category) => (
                <Disclosure.Button
                  key={category.name}
                  as="a"
                  href={`/kategorija/${category.slug}`}
                  className={classNames(
                    category.slug === path[2] ? 'bg-teal-800 text-white' : 'text-gray-900 hover:bg-gray-200',
                    'block px-3 py-2 rounded-md text-base font-medium'
                  )}
                  aria-current={category.slug === path[2] ? 'page' : undefined}
                >
                  {category.name}
                </Disclosure.Button>
              ))}
            </div>
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
    )
    
}
export default NavigationBar;