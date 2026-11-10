// HospedaPlus hotels, from the db_simulated catalog (catalog/catalog.json).
export const HOTELS = [
  {
    "code": "HP-PT-001",
    "name": "HospedaPlus Lisboa City",
    "city": "Lisbon",
    "country": "PT"
  },
  {
    "code": "HP-PT-002",
    "name": "HospedaPlus Algarve Resort",
    "city": "Faro",
    "country": "PT"
  },
  {
    "code": "HP-PT-003",
    "name": "HospedaPlus Porto Ribeira",
    "city": "Porto",
    "country": "PT"
  },
  {
    "code": "HP-CO-001",
    "name": "HospedaPlus Barranquilla Prado",
    "city": "Barranquilla",
    "country": "CO"
  },
  {
    "code": "HP-CO-002",
    "name": "HospedaPlus Cartagena Bocagrande",
    "city": "Cartagena",
    "country": "CO"
  },
  {
    "code": "HP-CO-003",
    "name": "HospedaPlus Cartagena Centro Histórico",
    "city": "Cartagena",
    "country": "CO"
  },
  {
    "code": "HP-CO-004",
    "name": "HospedaPlus Santa Marta Rodadero",
    "city": "Santa Marta",
    "country": "CO"
  },
  {
    "code": "HP-CO-005",
    "name": "HospedaPlus Bogotá Chico",
    "city": "Bogotá",
    "country": "CO"
  },
  {
    "code": "HP-CO-006",
    "name": "HospedaPlus Bogotá Aeropuerto",
    "city": "Bogotá",
    "country": "CO"
  },
  {
    "code": "HP-CO-007",
    "name": "HospedaPlus Medellín Poblado",
    "city": "Medellín",
    "country": "CO"
  },
  {
    "code": "HP-CO-008",
    "name": "HospedaPlus Cali Granada",
    "city": "Cali",
    "country": "CO"
  },
  {
    "code": "HP-CO-009",
    "name": "HospedaPlus San Andrés Spratt",
    "city": "San Andrés",
    "country": "CO"
  },
  {
    "code": "HP-CO-010",
    "name": "HospedaPlus Pereira Eje Cafetero",
    "city": "Pereira",
    "country": "CO"
  },
  {
    "code": "HP-MX-001",
    "name": "HospedaPlus Cancún Zona Hotelera",
    "city": "Cancún",
    "country": "MX"
  },
  {
    "code": "HP-MX-002",
    "name": "HospedaPlus Playa del Carmen",
    "city": "Playa del Carmen",
    "country": "MX"
  },
  {
    "code": "HP-MX-003",
    "name": "HospedaPlus CDMX Reforma",
    "city": "Mexico City",
    "country": "MX"
  },
  {
    "code": "HP-MX-004",
    "name": "HospedaPlus Guadalajara Centro",
    "city": "Guadalajara",
    "country": "MX"
  },
  {
    "code": "HP-MX-005",
    "name": "HospedaPlus Monterrey Valle",
    "city": "Monterrey",
    "country": "MX"
  },
  {
    "code": "HP-MX-006",
    "name": "HospedaPlus Los Cabos Marina",
    "city": "Cabo San Lucas",
    "country": "MX"
  },
  {
    "code": "HP-BR-001",
    "name": "HospedaPlus Rio Copacabana",
    "city": "Rio de Janeiro",
    "country": "BR"
  },
  {
    "code": "HP-BR-002",
    "name": "HospedaPlus São Paulo Paulista",
    "city": "São Paulo",
    "country": "BR"
  },
  {
    "code": "HP-BR-003",
    "name": "HospedaPlus Salvador Barra",
    "city": "Salvador",
    "country": "BR"
  },
  {
    "code": "HP-BR-004",
    "name": "HospedaPlus Florianópolis Jurere",
    "city": "Florianópolis",
    "country": "BR"
  },
  {
    "code": "HP-BR-005",
    "name": "HospedaPlus Recife Boa Viagem",
    "city": "Recife",
    "country": "BR"
  },
  {
    "code": "HP-BR-006",
    "name": "HospedaPlus Manaus Centro",
    "city": "Manaus",
    "country": "BR"
  },
  {
    "code": "HP-ES-001",
    "name": "HospedaPlus Madrid Gran Via",
    "city": "Madrid",
    "country": "ES"
  },
  {
    "code": "HP-ES-002",
    "name": "HospedaPlus Barcelona Eixample",
    "city": "Barcelona",
    "country": "ES"
  },
  {
    "code": "HP-ES-003",
    "name": "HospedaPlus Tenerife Costa Adeje",
    "city": "Tenerife",
    "country": "ES"
  }
] as const;

export type Hotel = (typeof HOTELS)[number];
