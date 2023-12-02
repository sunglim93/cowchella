
const VERTEX_STRIDE = 36;
const SPHERE_STRIDE = 48;

class Mesh {
    /** 
     * Creates a new mesh and loads it into video memory.
     * 
     * @param {WebGLRenderingContext} gl  
     * @param {number} program
     * @param {number[]} vertices
     * @param {number[]} indices
    */
    constructor( gl, program, vertices, indices ) {
        this.verts = create_and_load_vertex_buffer( gl, vertices, gl.STATIC_DRAW );
        this.indis = create_and_load_elements_buffer( gl, indices, gl.STATIC_DRAW );

        this.n_verts = vertices.length;
        this.n_indis = indices.length;
        this.program = program;
    }

    /**
     * Create a box mesh with the given dimensions and colors.
     * @param {WebGLRenderingContext} gl 
     * @param {number} width 
     * @param {number} height 
     * @param {number} depth 
     */

    static box( gl, program, width, height, depth ) {
        let hwidth = width / 2.0;
        let hheight = height / 2.0;
        let hdepth = depth / 2.0;

        let verts = [
            //x, y, z, r, g, b, a, u, v
            hwidth, -hheight, -hdepth, 1.0, 0.0, 0.0, 1.0,    0.25, 0.5, //0
            hwidth, -hheight, -hdepth, 1.0, 0.0, 0.0, 1.0,    0.25, 0.5,//1
            hwidth, -hheight, -hdepth, 1.0, 0.0, 0.0, 1.0,    0.5, 0.75,//2

            -hwidth, -hheight, -hdepth, 0.0, 1.0, 0.0, 1.0,   0, 0.5, //3
            -hwidth, -hheight, -hdepth, 0.0, 1.0, 0.0, 1.0,   1, 0.5,//4
            -hwidth, -hheight, -hdepth, 0.0, 1.0, 0.0, 1.0,   0.75, 0.75, //5

            -hwidth, hheight, -hdepth, 0.0, 0.0, 1.0, 1.0,   0, 0.25, //6 
            -hwidth, hheight, -hdepth, 0.0, 0.0, 1.0, 1.0,   0.75, 0,//7
            -hwidth, hheight, -hdepth, 0.0, 0.0, 1.0, 1.0,   1, 0.25,//8

            hwidth, hheight, -hdepth, 1.0, 1.0, 0.0, 1.0,    0.25, 0.25, //9
            hwidth, hheight, -hdepth, 1.0, 1.0, 0.0, 1.0,    0.25, 0.25,//10
            hwidth, hheight, -hdepth, 1.0, 1.0, 0.0, 1.0,    0.5, 0, //11  

            hwidth, -hheight, hdepth, 1.0, 0.0, 1.0, 1.0,    0.5, 0.5,//12
            hwidth, -hheight, hdepth, 1.0, 0.0, 1.0, 1.0,    0.5, 0.5, //13
            hwidth, -hheight, hdepth, 1.0, 0.0, 1.0, 1.0,    0.5, 0.5, //14

            -hwidth, -hheight, hdepth, 0.0, 1.0, 1.0, 1.0,   0.75, 0.5,//15
            -hwidth, -hheight, hdepth, 0.0, 1.0, 1.0, 1.0,   0.75, 0.5,//16
            -hwidth, -hheight, hdepth, 0.0, 1.0, 1.0, 1.0,   0.75, 0.5,//17

            -hwidth, hheight, hdepth, 0.5, 0.5, 1.0, 1.0,    0.75, 0.25,//18
            -hwidth, hheight, hdepth, 0.5, 0.5, 1.0, 1.0,    0.75, 0.25,//19
            -hwidth, hheight, hdepth, 0.5, 0.5, 1.0, 1.0,    0.75, 0.25, //20

            hwidth, hheight, hdepth, 1.0, 1.0, 0.5, 1.0,     0.5, 0.25,//21
            hwidth, hheight, hdepth, 1.0, 1.0, 0.5, 1.0,     0.5, 0.25, //22
            hwidth, hheight, hdepth, 1.0, 1.0, 0.5, 1.0,     0.5, 0.25//23
        ];

        let indis = [
            // clockwise winding
            /*
            0, 1, 2, 2, 3, 0, 
            4, 0, 3, 3, 7, 4, 
            5, 4, 7, 7, 6, 5, 
            1, 5, 6, 6, 2, 1,
            3, 2, 6, 6, 7, 3,
            4, 5, 1, 1, 0, 4,
            */

            // counter-clockwise winding
            0, 9, 3, 3, 9, 6, //front
            12, 21, 1, 1, 21, 10, //right
            15, 18, 13, 13, 18, 22, //back
            4, 8, 16, 16, 8, 20, //left
            19, 7, 23, 23, 7, 11, //top
            5, 17, 2, 2, 17, 14 //bottom
        ];

        return new Mesh( gl, program, verts, indis );
    }

    static make_uv_sphere(gl, program, subdivs, material){
        let verts = [];
        let indis = [];
        const TAU = Math.PI * 2;
        //for each layer
        for (let layer = 0; layer <=subdivs; layer++){
            let y_turns = layer / subdivs / 2;
            let rs = Math.sin(2 * Math.PI * y_turns);
            let y = Math.cos(y_turns * TAU) / 2;
            let vertices = subdivs+1;
            
            for(let subdiv = 0; subdiv <= subdivs; subdiv++){
                let turns = subdiv/subdivs;
                let rads = turns * TAU;
                let x = Math.cos(rads)/2 * rs;
                let z = Math.sin(rads)/2 * rs;
                let u = subdiv/subdivs;
                let v = layer/subdivs;
                verts.push(x,y,z); //add x, y, z, r, g, b, a, u, v, norm x, norm y, norm z
                verts.push(1.0,1.0,1.0,1.0);
                verts.push(u,v);
                let normals = new Vec4(x, y, z, 0.0).norm();
                verts.push(normals.x, normals.y, normals.z);
            }

            if (layer > 0){
                for (let i = 0; i < vertices; i++){
                    if (i == vertices - 1){ //for the last quad
                        let bottomLeft = (layer*vertices) + i; 
                        let bottomRight = (layer*vertices);
                        let topRight =  (layer-1)*vertices + i + 1;
                        let topLeft = ((layer-1)*vertices) + i;
                        indis.push(bottomLeft, bottomRight, topRight, topRight, topLeft, bottomLeft);
                    }else{
                        let bottomLeft = layer * vertices + i;
                        let bottomRight = layer * vertices + i + 1;
                        let topRight = (layer-1) * vertices + i + 1;
                        let topLeft = (layer-1) * vertices + i;
                        indis.push(bottomLeft, bottomRight, topRight, topRight, topLeft, bottomLeft);
                    }
                    
                }
            }
        }
        gl.bindTexture(gl.TEXTURE_2D, material.texture);
        return new Mesh(gl, program, verts, indis);
    }

   /**
     * Render the mesh. Does NOT preserve array/index buffer or program bindings! 
     * 
     * @param {WebGLRenderingContext} gl 
     */
   sphere_render( gl ) {
        gl.cullFace( gl.BACK );
        gl.enable( gl.CULL_FACE );
        
        set_uniform_scalar(gl, this.program, 'mat_ambient', material.ambient);
        set_uniform_scalar(gl, this.program, 'mat_diffuse', material.diffuse);
        set_uniform_scalar(gl, this.program, 'mat_specular', material.specular);
        set_uniform_scalar(gl, this.program, 'mat_shininess', material.shininess);
        
        gl.useProgram( this.program );
        gl.bindBuffer( gl.ARRAY_BUFFER, this.verts );
        gl.bindBuffer( gl.ELEMENT_ARRAY_BUFFER, this.indis );

        set_vertex_attrib_to_buffer( 
            gl, this.program, 
            "coordinates", 
            this.verts, 3, 
            gl.FLOAT, false, SPHERE_STRIDE, 0 
        );

        set_vertex_attrib_to_buffer( 
            gl, this.program, 
            "color", 
            this.verts, 4, 
            gl.FLOAT, false, SPHERE_STRIDE, 12
        );

        set_vertex_attrib_to_buffer(
            gl, this.program,
            "uv",
            this.verts, 2,
            gl.FLOAT, false, SPHERE_STRIDE, 28
        );

        set_vertex_attrib_to_buffer(
            gl, this.program,
            "normal",
            this.verts, 3,
            gl.FLOAT, false, SPHERE_STRIDE, 36
        );
        gl.drawElements( gl.TRIANGLES, this.n_indis, gl.UNSIGNED_SHORT, 0 );
    }


    /**
     * Render the mesh. Does NOT preserve array/index buffer or program bindings! 
     * 
     * @param {WebGLRenderingContext} gl 
     */
    render( gl ) {
        gl.cullFace( gl.BACK );
        gl.enable( gl.CULL_FACE );
        
        gl.useProgram( this.program );
        gl.bindBuffer( gl.ARRAY_BUFFER, this.verts );
        gl.bindBuffer( gl.ELEMENT_ARRAY_BUFFER, this.indis );

        set_vertex_attrib_to_buffer( 
            gl, this.program, 
            "coordinates", 
            this.verts, 3, 
            gl.FLOAT, false, VERTEX_STRIDE, 0 
        );

        set_vertex_attrib_to_buffer( 
            gl, this.program, 
            "color", 
            this.verts, 4, 
            gl.FLOAT, false, VERTEX_STRIDE, 12
        );

        set_vertex_attrib_to_buffer(
            gl, this.program,
            "uv",
            this.verts, 2,
            gl.FLOAT, false, VERTEX_STRIDE, 28
        );

        gl.drawElements( gl.TRIANGLES, this.n_indis, gl.UNSIGNED_SHORT, 0 );
    }

    /**
     * Parse the given text as the body of an obj file.
     * @param {WebGLRenderingContext} gl
     * @param {WebGLProgram} program
     * @param {string} text
     */
    static from_obj_text( gl, program, text ) {
        let lines = text.split( /\r?\n/ );

        let verts = [];
        let indis = [];
        

        for( let line of lines ) {
            let trimmed = line.trim();
            let parts = trimmed.split( /(\s+)/ );

            if( 
                parts === null || parts.length < 2 || 
                parts[0] == '#' || parts[0] === '' ) 
            { 
                continue; 
            }
            else if( parts[0] == 'v' ) {
                
                verts.push( parseFloat( parts[2] ) );
                verts.push( parseFloat( parts[4] ) );
                verts.push( parseFloat( parts[6] ) );
                
                // color data
                verts.push( 1, 1, 1, 1 );
            }
            else if( parts[0] == 'f' ) {
                indis.push( parseInt( parts[2] ) - 1 );
                indis.push( parseInt( parts[4] ) - 1 );
                indis.push( parseInt( parts[6] ) - 1 );
            }
            else {
                console.log( parts) ;
                throw new Error( 'unsupported obj command: ', parts[0], parts );
            }
        }
		
		//console.log( verts.slice(540, 600) )
		// console.log( indis.slice(540, 600) )
        
        return new Mesh( gl, program, verts, indis );
    }

    /**
     * Asynchronously load the obj file as a mesh.
     * @param {WebGLRenderingContext} gl
     * @param {string} file_name 
     * @param {WebGLProgram} program
     * @param {function} f the function to call and give mesh to when finished.
     */
    static from_obj_file( gl, file_name, program, f ) {
        let request = new XMLHttpRequest();
        
        // the function that will be called when the file is being loaded
        request.onreadystatechange = function() {
            // console.log( request.readyState );

            if( request.readyState != 4 ) { return; }
            if( request.status != 200 ) { 
                throw new Error( 'HTTP error when opening .obj file: ', request.statusText ); 
            }

            // now we know the file exists and is ready
            let loaded_mesh = Mesh.from_obj_text( gl, program, request.responseText );

            console.log( 'loaded ', file_name );
            f( loaded_mesh );
        };

        
        request.open( 'GET', file_name ); // initialize request. 
        request.send();                   // execute request
    }
}