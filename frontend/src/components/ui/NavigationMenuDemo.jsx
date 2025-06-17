"use client"

import * as React from "react"
import { Link } from "react-router-dom";
import { CircleCheckIcon, CircleHelpIcon, CircleIcon } from "lucide-react"

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "./navigation-menu"

const components = [
  {
    title: "Multivitamins",
    to: "/docs/primitives/alert-dialog",
    description:
      "Complete daily nutrition in one convenient dose.",
  },
  {
    title: "Minerals & Calcium",
    to: "/docs/primitives/hover-card",
    description:
      "Essential building blocks for a strong, balanced body. Strengthen your bones and support muscle function.",
  },
  
]

export function NavigationMenuDemo() {
  return (
    <NavigationMenu viewport={false}>
      <NavigationMenuList>
        <NavigationMenuItem>
         <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
            <Link to="/">Home</Link>
          </NavigationMenuLink>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuTrigger>Products & Medicine</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[400px] gap-2 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
              {components.map((component) => (
                <ListItem
                  key={component.title}
                  title={component.title}
                  href={component.href}
                >
                  {component.description}
                </ListItem>
              ))}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
            <Link to="/blog">Blogs</Link>
          </NavigationMenuLink>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuTrigger>Fitness & Health </NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[300px] gap-4">
              <li>
                <NavigationMenuLink asChild>
                  <Link to="#">
                    <div className="font-medium">Whey Protein</div>
                    <div className="text-muted-foreground">
                      Fast-absorbing protein to fuel muscle growth and recovery.
                    </div>
                  </Link>
                </NavigationMenuLink>
                <NavigationMenuLink asChild>
                  <Link to="#">
                    <div className="font-medium">Pre/Post workout</div>
                    <div className="text-muted-foreground">
                      Energize before and recover better after every workout.
                    </div>
                  </Link>
                </NavigationMenuLink>
                <NavigationMenuLink asChild>
                  <Link to="#">
                    <div className="font-medium">Protein Supplements
                    </div>
                    <div className="text-muted-foreground">
                      Convenient protein boost to support your fitness goals.
                    </div>
                  </Link>
                </NavigationMenuLink>
              </li>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuTrigger>Beauty</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[200px] gap-4">
              <li>
                <NavigationMenuLink asChild>
                  <Link to="#">Personal Care</Link>
                </NavigationMenuLink>
                <NavigationMenuLink asChild>
                  <Link to="#">Hair care</Link>
                </NavigationMenuLink>
                <NavigationMenuLink asChild>
                  <Link to="#">Face care</Link>
                </NavigationMenuLink>
              </li>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuTrigger>Homeopathy</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[200px] gap-4">
              <li>
                <NavigationMenuLink asChild>
                  <Link to="#" className="flex-row items-center gap-2">
                    Fungal Infection
                  </Link>
                </NavigationMenuLink>
                <NavigationMenuLink asChild>
                  <Link to="#" className="flex-row items-center gap-2">
                    Diabetes
                  </Link>
                </NavigationMenuLink>
                <NavigationMenuLink asChild>
                  <Link to="#" className="flex-row items-center gap-2">
                    Sexual Wellness
                  </Link>
                </NavigationMenuLink>
              </li>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  )
}

function ListItem({ title, children, to, ...props }) {
  return (
    <li {...props}>
      <NavigationMenuLink asChild>
        <Link to={to}>
          <div className="text-sm leading-none font-medium">{title}</div>
          <p className="text-muted-foreground line-clamp-2 text-sm leading-snug">
            {children}
          </p>
        </Link>
      </NavigationMenuLink>
    </li>
  )
}
