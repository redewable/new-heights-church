import { describe, it, expect } from "vitest";
import {
  organizationSchema,
  localBusinessSchema,
  breadcrumbSchema,
} from "@/lib/seo/schema";
import { CHURCH } from "@/lib/constants/church";

describe("JSON-LD builders", () => {
  it("organizationSchema names the church + includes address + contact", () => {
    const s = organizationSchema();
    expect(s["@context"]).toBe("https://schema.org");
    expect(s["@type"]).toEqual(expect.arrayContaining(["Organization", "Church"]));
    expect(s.name).toBe(CHURCH.name);
    expect(s.telephone).toBe(CHURCH.contact.phone);
    expect(s.address.streetAddress).toBe(CHURCH.address.street);
  });

  it("localBusinessSchema encodes both service times as OpeningHours", () => {
    const s = localBusinessSchema();
    expect(s["@type"]).toEqual(
      expect.arrayContaining(["Church", "LocalBusiness", "PlaceOfWorship"]),
    );
    expect(s.openingHoursSpecification).toHaveLength(CHURCH.services.length);
    // Sunday 10:00 AM -> opens "10:00", closes "12:00"
    const sunday = s.openingHoursSpecification.find((o) =>
      o.dayOfWeek.endsWith("Sunday"),
    )!;
    expect(sunday.opens).toBe("10:00");
    expect(sunday.closes).toBe("12:00");
    // Wednesday 7:00 PM -> opens "19:00", closes "21:00"
    const wednesday = s.openingHoursSpecification.find((o) =>
      o.dayOfWeek.endsWith("Wednesday"),
    )!;
    expect(wednesday.opens).toBe("19:00");
    expect(wednesday.closes).toBe("21:00");
  });

  it("breadcrumbSchema resolves relative paths against the site origin", () => {
    const s = breadcrumbSchema([
      { name: "Home", href: "/" },
      { name: "Sermons", href: "/sermons" },
    ]);
    expect(s.itemListElement[0].item).toBe(`${CHURCH.urls.site}/`);
    expect(s.itemListElement[1].item).toBe(`${CHURCH.urls.site}/sermons`);
  });
});
