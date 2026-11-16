import pandas as pd, json, random
random.seed(42)
s = pd.read_csv('data-dummy/students_and_pretest.csv', dtype={'no_telepon': str})
t = pd.read_csv('data-dummy/transactions_and_cashbook.csv')
t = t.sort_values('tanggal_pembayaran')
latest = t.groupby('student_id').last()

def phone(p):
    p = ''.join(c for c in str(p) if c.isdigit())
    return p if p.startswith('0') else '0' + p

rows = []
for _, r in s.iterrows():
    tr = latest.loc[r.student_id]
    rows.append(dict(code=r.student_id, name=r.nama_siswa, phone=phone(r.no_telepon),
        program=tr.nama_program, mode=tr.jenis_kelas, level=r.recommended_level,
        status=r.status_pendaftaran, pre=int(r.skor_pretest), lis=int(r.skor_listening),
        gra=int(r.skor_grammar), reg=r.tanggal_daftar))

# perluas ke 1.000 baris (FR-11) mengikuti sebaran data asli
base = list(rows); used = {r['phone'] for r in rows}
first = ["Andi","Budi","Citra","Dewi","Eka","Fajar","Gita","Hana","Indra","Joko","Kevin","Lina","Maya","Nadia","Oscar","Putri","Rizky","Sari","Tono","Wulan","Yoga","Zahra","Agus","Bella","Dimas","Felix","Hendra","Jessica","Michael","Stefani","Vincent","Yohana"]
last = ["Santoso","Wijaya","Pratama","Halim","Tanoto","Saputra","Gunawan","Kurniawan","Lim","Setiawan","Hartono","Susanto","Nugroho","Wibowo","Chandra","Lesmana"]
for i in range(len(rows)+1, 1001):
    b = random.choice(base)
    while True:
        ph = "08" + "".join(random.choice("0123456789") for _ in range(10))
        if ph not in used: used.add(ph); break
    m = random.choice([9,10]); d = random.randint(1,30 if m==9 else 31)
    rows.append(dict(code=f"STD-{i:03d}", name=f"{random.choice(first)} {random.choice(last)}",
        phone=ph, program=b['program'], mode=b['mode'], level=b['level'],
        status=random.choice(base)['status'], pre=random.randint(30,95), lis=random.randint(30,95),
        gra=random.randint(30,95), reg=f"2026-{m:02d}-{d:02d}"))

out = []
for i, r in enumerate(rows, 1):
    code = "STD-%04d" % int(r['code'].split('-')[1])
    out.append({"id": f"stu_{i:04d}", "studentCode": code, "fullName": r['name'], "phone": r['phone'],
        "program": r['program'], "mode": r['mode'], "level": r['level'], "status": r['status'],
        "pretestScore": r['pre'], "listeningScore": r['lis'], "grammarScore": r['gra'],
        "registeredAt": r['reg'], "archivedAt": None, "updatedAt": r['reg'] + "T09:00:00.000Z"})
json.dump(out, open('src/data/students.json','w'), ensure_ascii=False)
print(len(out), out[0], out[-1], sep="\n")
