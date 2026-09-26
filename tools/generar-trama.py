# Genera la "trama de flujo" de VYGO (manual 7.2): cada celda es una recta o un cuarto de vuelta,
# grosor 1x y remates redondos. Cambia la semilla o los colores al final del archivo.
# Uso: python3 tools/generar-trama.py
import random, math, re
C=60  # cell size
SW=13 # stroke width (1x)
def gen(cols, rows, seed, pv=0.86, ph=0.5):
    rnd=random.Random(seed)
    # ports: V[r][c] = edge between cell(r-1,c) and cell(r,c) (horizontal edge, vertical movement)
    V=[[rnd.random()<pv for c in range(cols)] for r in range(rows+1)]
    H=[[rnd.random()<ph for c in range(cols+1)] for r in range(rows)]
    segs=[]  # (d, cellr, cellc, kind)
    for r in range(rows):
        for c in range(cols):
            x,y=c*C,r*C; m=C/2
            ports={'t':V[r][c],'b':V[r+1][c],'l':H[r][c],'r':H[r][c+1]}
            op=[k for k,v in ports.items() if v]
            if len(op)==3:
                op.remove(rnd.choice(op))
            pt={'t':(x+m,y),'b':(x+m,y+C),'l':(x,y+m),'r':(x+C,y+m)}
            corner={('t','r'):(x+C,y),('r','b'):(x+C,y+C),('b','l'):(x,y+C),('l','t'):(x,y)}
            def arc(a,b):
                k=(a,b) if (a,b) in corner else (b,a)
                (ax,ay),(bx,by)=pt[k[0]],pt[k[1]]
                return f"M{ax:g} {ay:g}A{m:g} {m:g} 0 0 0 {bx:g} {by:g}"
            ds=[]
            if len(op)==4:
                if rnd.random()<0.5: ds=[arc('t','r'),arc('b','l')]
                else: ds=[arc('r','b'),arc('l','t')]
            elif len(op)==2:
                a,b=op
                if {a,b}=={'t','b'} or {a,b}=={'l','r'}:
                    (ax,ay),(bx,by)=pt[a],pt[b]; ds=[f"M{ax:g} {ay:g}L{bx:g} {by:g}"]
                else: ds=[arc(a,b)]
            for d in ds:
                nums=[float(v) for v in re.findall(r'-?[\d.]+',d)]
                a=(nums[0],nums[1]); b=(nums[-2],nums[-1])
                segs.append((d,a,b))
    return segs
def svg(cols, rows, seed, colors, weights=None, bg=None, out='t.svg'):
    rnd=random.Random(seed+99)
    segs=gen(cols,rows,seed)
    W,Hh=cols*C,rows*C
    parts=[f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W} {Hh}" preserveAspectRatio="xMidYMid slice">']
    if bg: parts.append(f'<rect width="{W}" height="{Hh}" fill="{bg}"/>')
    # union-find components by shared endpoints
    par=list(range(len(segs)))
    def f(i):
        while par[i]!=i: par[i]=par[par[i]]; i=par[i]
        return i
    ends={}
    for i,(d,a,b) in enumerate(segs):
        for p in (a,b):
            ends.setdefault(p,[]).append(i)
    for p,ids in ends.items():
        for j in ids[1:]: par[f(j)]=f(ids[0])
    comp={}
    for i in range(len(segs)): comp.setdefault(f(i),[]).append(i)
    groups={col:[] for col in colors}
    for root,ids in comp.items():
        if len(ids)<3: continue
        col=colors[0] if len(colors)==1 else rnd.choices(colors,weights or [1]*len(colors))[0]
        for i in ids: groups[col].append(segs[i][0])
    for col,ds in groups.items():
        parts.append(f'<path fill="none" stroke="{col}" stroke-width="{SW}" stroke-linecap="round" d="{"".join(ds)}"/>')
    parts.append('</svg>')
    open(out,'w').write(''.join(parts))
import os
base=os.path.join(os.path.dirname(__file__), '..', 'assets', 'trama') + os.sep
svg(12,9,7,['#4143B5'],out=base+'trama-cobalto.svg')
svg(12,9,11,['#C9CBF0','#D9F2B0'],[0.62,0.38],out=base+'trama-suave.svg')
svg(12,9,23,['#B5FF5B','#E9EAF5'],[0.55,0.45],out=base+'trama-noche.svg')
svg(12,9,31,['#2B2F6E'],out=base+'trama-tinta.svg')
